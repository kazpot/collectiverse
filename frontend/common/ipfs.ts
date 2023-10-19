import { create as ipfsHttpClient } from 'ipfs-http-client';

const ipfsApi = process.env.NEXT_PUBLIC_IPFS_API || '';
const ipfsProjectId = process.env.NEXT_PUBLIC_IPFS_PROJECT_ID || '';
const ipfsSecret = process.env.NEXT_PUBLIC_IPFS_SECRET || '';
const authorization = 'Basic ' + Buffer.from(ipfsProjectId + ':' + ipfsSecret).toString('base64');

export const ipfsFileUrl = process.env.NEXT_PUBLIC_IPFS_FILE_URL || '';

export const client = ipfsHttpClient({
  url: ipfsApi,
  headers: {
    authorization,
  },
});
