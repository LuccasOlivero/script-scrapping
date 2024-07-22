const puppeteer = require("puppeteer");

async function formalScrape() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(
    "https://www.gitman.com/collections/the-gitman-shirt-collection"
  );

  const data = await page.$$eval(".js-product-block", (nodes) => {
    return nodes.map((node) => {
      const name =
        node.querySelector(".products__product-info h2")?.innerText.trim() ??
        "no name";
      const price = node
        .querySelector(".products__product-info .block.products__product-price")
        ?.innerText.trim();

      const imageNode = node.querySelector(".products__product-img");
      let imageUrl = imageNode?.style.backgroundImage || "";
      imageUrl = imageUrl.slice(5, -2); // Eliminar 'url("' y '")'
      // En caso de que `data-src` sea más confiable:
      if (!imageUrl && imageNode?.dataset.src) {
        imageUrl = imageNode.dataset.src;
      }
      return { name, price, image: imageUrl };
    });
  });

  console.log(data.slice(0, 10));
  await browser.close();
}

async function dressScrape() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(
    "https://www.grid.com.ar/indumentaria/remeras/hombre/unisex?initialMap=c&initialQuery=indumentaria&map=category-1,category-2,genero,genero"
  );

  // Seleccionar todos los elementos que contienen las prendas y extraer la información
  const data = await page.$$eval(
    ".vtex-search-result-3-x-galleryItem",
    (nodes) => {
      return nodes.map((node) => {
        const name = node
          .querySelector(".vtex-product-summary-2-x-productBrand")
          ?.innerText.trim();
        const price = node
          .querySelector(".vtex-product-summary-2-x-currencyInteger")
          ?.innerText.trim();

        const imageNode = node.querySelector(
          ".vtex-product-summary-2-x-imageNormal"
        );
        let imageUrl = "";
        if (imageNode) {
          imageUrl = imageNode.getAttribute("src");
        }
        return { name, price, image: imageUrl };
      });
    }
  );

  console.log(data.slice(0, 10));

  await browser.close();
}

async function lacosteScrape() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://www.underarmour.com.ar/c/remeras/");

  const data = await page.$$eval(".product", (nodes) => {
    return nodes.map((node) => {
      const name = node.querySelector(".pdp-link")?.innerText.trim();
      const price = node
        .querySelector(".value")
        ?.innerText.trim()
        .replace("Precio reducido de\n", "")
        .replace("\nhasta", "");

      let imageUrl = "";
      const imageNode = node.querySelector(".tile-image");
      if (imageNode) {
        imageUrl = imageNode.getAttribute("src");
      }
      return {
        name,
        price,
        image: `https://www.underarmour.com.ar/${imageUrl}`,
      };
    });
  });

  console.log(data.slice(0, 10));
  await browser.close();
}

lacosteScrape();
formalScrape();
dressScrape();
