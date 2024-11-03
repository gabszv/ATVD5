
require('dotenv').config();
const nodemailer = require('nodemailer');
const scrapeBooks = require('./Scraping');

async function sendEmail(bookDetails) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  
  let emailContent = `
    <h1 style="color: #333; text-align: center;">Livros Disponíveis na Book Store</h1>
    <p style="text-align: center; font-size: 1.1em;">Aqui estão alguns livros disponíveis, com seus preços e status de estoque:</p>
    <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;">
      <thead>
        <tr style="background-color: #f4f4f4;">
          <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Título</th>
          <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Preço</th>
          <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Disponibilidade</th>
        </tr>
      </thead>
      <tbody>`;

  bookDetails.forEach(book => {
    emailContent += `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;">${book.titulo}</td>
        <td style="padding: 10px; border: 1px solid #ddd; color: #28a745;">${book.preco}</td>
        <td style="padding: 10px; border: 1px solid #ddd; color: ${book.estoque === 'Disponível' ? '#28a745' : '#dc3545'};">
          ${book.estoque}
        </td>
      </tr>`;
  });

  emailContent += `
      </tbody>
    </table>
    <p style="text-align: center; color: #777; font-size: 0.9em; margin-top: 20px;">
      Enviado automaticamente por Book Store Scraper
    </p>
  `;

  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL_RECIPIENT,
    subject: 'Livros Disponíveis na Book Store',
    html: emailContent,
  };

  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('Erro ao enviar o email:', error);
    }
    console.log('Email enviado:', info.response);
  });
}

async function main() {
  const bookDetails = await scrapeBooks();
  if (bookDetails.length > 0) {
    await sendEmail(bookDetails);
  } else {
    console.log('Nenhuma informação de livro encontrada.');
  }
}

main();
