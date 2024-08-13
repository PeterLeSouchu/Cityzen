async function sendMail(transporter, htmlCode) {
  // Send mail with defined transporter object
  try {
    const info = await transporter.sendMail({
      from: `"DevOps - Equipe CityZen" <cef>`,
      to: 'test@test.fr',
      subject: 'CityZen - Votre code de confirmation',
      // text: "Hello world?",
      html: htmlCode,
    });

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    throw new ApiError(
      internalServerError.details,
      internalServerError.message.global,
      error
    );
  }
}

export default sendMail;
