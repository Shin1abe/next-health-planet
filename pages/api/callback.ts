import { NextApiHandler } from "next";
import axios from "axios";

import querystring from "query-string";

const callbackHandler: NextApiHandler = async (req, res) => {

  console.log("callback")

  const code = req.query.code as string;
  const requestBody = {
    code,
    grant_type: "authorization_code",
    client_id: process.env.NEXT_PUBLIC_HEALTHPLANET_CLIENT_ID,
    client_secret: process.env.NEXT_PUBLIC_HEALTHPLANET_CLIENT_SECRET,
    redirect_uri: process.env.NEXT_PUBLIC_HEALTHPLANET_REDIRECT_URI,
  };

  try {
    const response = await axios.post(
      "https://www.healthplanet.jp/oauth/token",
      querystring.stringify(requestBody),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    // console.log(response.data);
    // サーバ(api)で実行した結果をクライアントのnextjsあぷりに引き渡すために実装。クライアント側は
    // getServerSidePropsで受取る必要あり
    res.status(200).redirect(`/components/InnerScanTable?access_token=${response.data.access_token as string}`)
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
};

export default callbackHandler;
