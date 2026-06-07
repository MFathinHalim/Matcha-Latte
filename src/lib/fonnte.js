export async function sendWhatsapp(
  phone,
  message
) {
  try {
    const res = await fetch(
      "https://api.fonnte.com/send",
      {
        method: "POST",

        headers: {
          Authorization:
            process.env.FONTTE_TOKEN,
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          target: phone,
          message,
        }),
      }
    );

    const data =
      await res.json();

    console.log(
      "========== FONTTE =========="
    );

    console.log(
      "PHONE:",
      phone
    );

    console.log(
      "STATUS:",
      res.status
    );

    console.log(
      "RESPONSE:",
      JSON.stringify(
        data,
        null,
        2
      )
    );

    console.log(
      "============================"
    );

    return data;
  } catch (error) {
    console.error(
      "FONTTE ERROR:",
      error
    );

    throw error;
  }
}