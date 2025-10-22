import type { NextApiRequest } from 'next';

const isRequestSecure = (req: NextApiRequest): boolean => {
   const protoHeader = req.headers['x-forwarded-proto'];
   if (Array.isArray(protoHeader)) {
      if (protoHeader.some((value) => value?.toLowerCase() === 'https')) {
         return true;
      }
   } else if (typeof protoHeader === 'string') {
      // Split on commas to handle comma-delimited values from multi-proxy deployments
      const protocols = protoHeader.split(',').map((p) => p.trim().toLowerCase());
      if (protocols.includes('https')) {
         return true;
      }
   }

   const forwardedProtocol = req.headers['x-forwarded-protocol'];
   if (typeof forwardedProtocol === 'string' && forwardedProtocol.toLowerCase() === 'https') {
      return true;
   }

   const forwardedSsl = req.headers['x-forwarded-ssl'];
   if (typeof forwardedSsl === 'string' && forwardedSsl.toLowerCase() === 'on') {
      return true;
   }

   const socket = req.socket as { encrypted?: boolean } | undefined;
   return socket?.encrypted === true;
};

export default isRequestSecure;
