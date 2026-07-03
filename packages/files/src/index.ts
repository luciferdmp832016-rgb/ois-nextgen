export interface FileStorageAdapter {
  put(path: string, bytes: Uint8Array): Promise<void>;
  get(path: string): Promise<Uint8Array | null>;
}

export class LocalOnlyFileStorage implements FileStorageAdapter {
  async put(): Promise<void> {
    return Promise.resolve();
  }

  async get(): Promise<Uint8Array | null> {
    return Promise.resolve(null);
  }
}
