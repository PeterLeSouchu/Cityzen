function generateHTMLMail(pseudo, OTP) {
  return `
<h1> CityZen </h1>
<p>Bonjour ${pseudo},</p>
<p>Nous vous souhaitons la bienvenue chez CityZen! </p>
<p>Pour valider votre inscription, il ne vous suffit plus qu'à renseigner le code suivant sur la plateforme: <span>${OTP}</span></p>
<p>À tout de suite !</p>
`;
}

export default generateHTMLMail;
