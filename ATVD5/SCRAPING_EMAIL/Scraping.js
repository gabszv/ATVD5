// scraping.js
const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeBooks() {
  try {
    const url = 'https://books.toscrape.com';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

   
    let bookDetails = [];

    
    $('.product_pod').each((index, element) => {
      const titulo = $(element).find('h3 a').attr('title');
      const preco = $(element).find('.price_color').text();
      const estoque = $(element).find('.instock.availability').text().trim();

      bookDetails.push({
        titulo,
        preco,
        estoque: estoque.includes('In stock') ? 'Disponível' : 'Fora de estoque',
      });
    });

    return bookDetails;
  } catch (error) {
    console.error('Erro ao fazer scraping:', error);
    return [];
  }
}

module.exports = scrapeBooks;
