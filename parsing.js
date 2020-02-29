const cheerio = require('cheerio');

module.exports = {
    parse_result_page
};

function parse_result_page(raw_html) {
    const $ = cheerio.load(raw_html);
    const datas = [];
    const transaction = $(".form-search__locations button").text().trim();
    // const transaction_type = transaction.split(' ')[0];
    //  const realty_type = transaction.split(' ')[1];
    
    $("ul.list-cards li").each(function() {
        const price = $(this).find(".item-card__price strong").text();
        if (price === '') {
            return;
        }
        

        const surface = $(this).find(".item-card__surface strong").text();
        const surface_unit = $(this).find(".item-card__surface abbr").text();
        //const title = $(this).find(".item-card__title strong").text();
        const code = $(this).find(".item-card__title span").text().trim();
         const url = $(this).find('.item-card__core a').attr('href');

        datas.push({
            code,
            price,
            surface,
            surface_unit,
            transaction,
             url
        });
    });

    return datas;
}

