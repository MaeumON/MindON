//질문 시작 시, 참가자 리스트 보내는 시그널
export function sendSignalQuestionChanged(data) {
  const signalOptions = {
    data: JSON.stringify(data),
    type: "questionChanged",
  };
  data.session?.signal(signalOptions);
}
