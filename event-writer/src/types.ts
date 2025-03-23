type CallerId = {
  calleridnum: string;
  calleridname: string;
};

export type CallEvent = {
  callStatus: string;
  callTimestamp: string;
  callerId: CallerId;
  channel: string;
};
