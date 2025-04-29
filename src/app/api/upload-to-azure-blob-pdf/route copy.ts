import { NextRequest, NextResponse } from "next/server";
import {
    BlobServiceClient,
    generateBlobSASQueryParameters,
    BlobSASPermissions,
    SASProtocol,
    StorageSharedKeyCredential
} from "@azure/storage-blob";

const account = process.env.AZURE_STORAGE_ACCOUNT_NAME!;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY!;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME_PDF!;

const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    sharedKeyCredential
);

function sanitizeBlobName(name: string): string {
    return name
        .normalize("NFD")                        // split accents from letters
        .replace(/[\u0300-\u036f]/g, "")         // remove accents
        .replace(/[^a-zA-Z0-9._-]/g, "-")        // replace unsafe characters
        .replace(/-+/g, "-")                     // collapse multiple dashes
        .replace(/^-|-$/g, "");                  // trim leading/trailing dashes
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const files = formData.getAll("files") as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: "No files provided" }, { status: 400 });
        }

        const containerClient = blobServiceClient.getContainerClient(containerName);

        await containerClient.createIfNotExists({ access: undefined });

        const uploadedUrls: string[] = [];

        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const sanitizedName = sanitizeBlobName(file.name);
            const blobName = `${Date.now()}-${sanitizedName}`;
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            await blockBlobClient.uploadData(buffer, {
                blobHTTPHeaders: { blobContentType: file.type },
            });

            const expiresOn = new Date(Date.now() + 3600 * 1000);
            const sasToken = generateBlobSASQueryParameters(
                {
                    containerName,
                    blobName,
                    permissions: BlobSASPermissions.parse("r"),
                    expiresOn,
                    protocol: SASProtocol.Https,
                },
                sharedKeyCredential
            ).toString();

            const sasUrl = `${blockBlobClient.url}?${sasToken}`;
            uploadedUrls.push(sasUrl);
        }

        return NextResponse.json({ urls: uploadedUrls });

    } catch (err: any) {
        console.error('Azure Upload Error:', err);
        return NextResponse.json({ error: "Internal Server Error", details: err.message }, { status: 500 });
    }
}
