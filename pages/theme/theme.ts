import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: 'dark', // ダークモードをデフォルトに設定
    useSystemColorMode: false, // OSの設定を使わせない
  },
  // styles: {
  //   global: {
  //     body: {
  //       backgroundColor: "gray.100",
  //       color: "gray.800"
  //     }
  //   }
  // }
});
export default theme;
