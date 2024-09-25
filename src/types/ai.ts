// src/types.ts
export type MessageRole = 'function' | 'system' | 'user' | 'assistant' | 'data' | 'tool';

export interface Message {
    id: string;
    role: MessageRole;
    content: string;
}
