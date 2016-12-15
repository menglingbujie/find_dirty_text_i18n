import React from "react";
import LangClient from "./tools/Lang-Client";

export default class ReactServerRenderEntry extends React.Component {
  constructor(props) {
    super(props);

    if (!(typeof window !== 'undefined')) {
      //服务端渲染
      let langMap = this.props.serverLangMap;
      let langKeys = this.props.serverLangKeys;
      LangClient.init(langMap.map(langKeys), langMap.lang);
    }
  }
}