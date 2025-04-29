import { NextRequest, NextResponse } from "next/server";
import { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions, SASProtocol, StorageSharedKeyCredential } from "@azure/storage-blob";

const account = process.env.AZURE_STORAGE_ACCOUNT_NAME!;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY!;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME_AUDIO!;

const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    sharedKeyCredential
);

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const containerClient = blobServiceClient.getContainerClient(containerName);

    // ✨ Try creating azure container if it doesn't exist
    await containerClient.createIfNotExists({
        access: undefined, // <-- means private container
    });


    const buffer = Buffer.from(await file.arrayBuffer());

    function sanitizeBlobName(name: string) {
        return name
            .normalize("NFD")                          // split accented letters
            .replace(/[\u0300-\u036f]/g, "")            // remove accents
            .replace(/[^a-zA-Z0-9._-]/g, "-")           // replace anything not safe
            .replace(/-+/g, "-")                        // collapse multiple dashes
            .replace(/^-|-$/g, "");                     // remove leading/trailing dashes
    }





    // Encode the file name to make it URL-safe 
    const safeFileName = sanitizeBlobName(file.name);
    const blobName = `${Date.now()}-${safeFileName}`;

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: { blobContentType: file.type },
    });

    // Create SAS URL
    const expiresOn = new Date(new Date().valueOf() + 3600 * 1000); // 1 hour
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

    return NextResponse.json({ sasUrl });
}

