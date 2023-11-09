import * as MailComposer from "expo-mail-composer";

export const sendEmail = async () => {
  let options = {
    subject: "문의사항 제목을 입력해주세요",
    recipients: ["official.ohyes@gmail.com"],
    body: "문의사항 내용을 입력해주세요",
  };

  let promise = new Promise((resolve, reject) => {
    MailComposer.composeAsync(options)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });

  let statusText = (type) => {
    switch (type) {
      case "cancelled":
        return "문의 메일이 임시저장되지 않았습니다";
      case "saved":
        return "문의 메일이 임시저장되었습니다";
      case "sent":
        return "문의 메일이 전송되었습니다";
      case "undeterminded":
        return "오류가 발생했습니다";
    }
  };

  promise.then(
    (result) => {
      const message = statusText(result);
      //   const message = statusText(result.status);
      // makeToast(message);
    },
    (err) => {
      // makeToast(`에러: ${err}의 이유로 문제가 발생했습니다`, true);
    }
  );
};
