node -e 'const API_KEY="test"; const BASE_URL="https://main.d1ougq7j1szw3s.amplifyapp.com"; const payload={webhookUrl:"https://eorefjkxmj0gxin.m.pipedream.net",steps:["DOCUMENT","FACE","RESIDENCE"],exp:Math.floor(Date.now()/1000)+3600}; const token=Buffer.from(JSON.stringify(payload)).toString("base64"); const urlKyc=`${BASE_URL}/kyc?token=${encodeURIComponent(token)}&apiKey=${encodeURIComponent(API_KEY)}`; const urlLiveness=`${BASE_URL}/auth/sign-up/step/face-biometry/liveness`; console.log("TOKEN="+token); console.log("KYC_URL="+urlKyc); console.log("LIVENESS_URL="+urlLiveness);'

Config backend (api keys permitidas):
KYC_ALLOWED_API_KEYS=key_prod_1,key_prod_2,key_hml_1


