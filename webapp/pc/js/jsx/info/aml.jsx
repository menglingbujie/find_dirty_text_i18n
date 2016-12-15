import React from "react";
import $ from "jquery";

import LangClient from '../tools/Lang-Client';
import Cookie from "../tools/cookie";
import Config from "../config/config";

export default class AML extends React.Component{
  constructor(props){
    super(props);
    this.state = {

    }
  }
  render(){
    return (
        <div className="wrap_right_connectUs" style={{"display":"none"}}>

            <p>{LangClient.i18n("All wholly owned or controlled by Finance Managers Co. Limited group of companies are committed to implementing single global standards shaped by the most effective anti-money laundering standards available in any location where Finance Managers operates.")}</p>
             <p>{LangClient.i18n("Finance Managers has established a Global Anti-Money Laundering Programme (“AML Programme”) for this purpose. The objective of the AML Programme is to ensure that money laundering risks identified by Finance Managers are appropriately mitigated. This is achieved by establishing: Board-approved, minimum governing policies, principles, and standards; and implementing appropriate controls, to protect Finance Managers, its employees, shareholders, and customers from money laundering. The AML Programme provides guidance to all Finance Managers employees gathered in the Group, requiring them to conduct business in accordance with applicable AML laws, rules, and regulations.")}</p>

             <p>{LangClient.i18n("The AML Programme is based upon various laws, regulations and regulatory guidance from the United Kingdom, the European Union, Hong Kong, the United States of America, and, as applicable, local jurisdictions in which Finance Managers does business.")}</p>

             <p>{LangClient.i18n("The Programme includes but is not limited to:")}</p>

             <p>{LangClient.i18n("• The appointment of a Global Money Laundering Reporting Officer or alternative position as required by local regulation;")}</p>

             <p>{LangClient.i18n("• A Customer Due Diligence (“CDD”) Programme, which incorporates Customer Identification and Verification (“ID&V”) and Know Your Customer (“KYC”) principles, and the implementing of programmes designed to appropriately remediate CDD of our existing customers;")}</p>

            <p>{LangClient.i18n("• Conducting enhanced due diligence (“EDD”) on  customers assessed as higher risk, such as Politically Exposed Persons (“PEPs”) in senior positions, their relatives and close associates;")}</p>

            <p>{LangClient.i18n("• Establishing processes and systems designed to monitor customer transactions for the purpose of identifying suspicious activity;")}</p>

            <p>{LangClient.i18n("• The investigation and subsequent reporting of suspicious activity to the appropriate regulatory bodies;")}</p>

            <p>{LangClient.i18n("• Mandated regular independent testing and regular AML training of its employees and contractors;")}</p>

            <p>{LangClient.i18n("• The prohibition of the following products, services and customer types:")}</p>

            <p>{LangClient.i18n("• Anonymous accounts or customers seeking to maintain an account in an obviously fictitious name;")}</p>

            <p>{LangClient.i18n("• Shell banks, ie, banks with no physical presence or staff;")}</p>

            <p>{LangClient.i18n("• Payable-through-accounts, ie, HSBC does not allow domestic or foreign bank customers to provide payable-through-accounts to their customers on their HSBC accounts; ")}</p>

            <p>{LangClient.i18n("• Any relevant additional local requirements.")}</p>

        </div>
      )
  }
}
