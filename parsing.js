const cheerio = require('cheerio');
 
module.exports = {
    parse_result_page
};

function parse_result_page(raw_html, Url) {
    const $ = cheerio.load(raw_html);
    
    const datas = [];
    const transaction = $(".block-search-results__heading__top").text().trim();
     const transaction_type = transaction.split(' ')[0];
      const realty_type = transaction.split(' ')[1];
 
    $("ul.list-cards li").each(function() {
        const price = parseInt($(this).find(".item-card__price strong").text().replace(/\s/g, ''), 10);
        if (price === '') {
            return;
        }
        

        const surface = parseInt($(this).find(".item-card__surface strong").text().replace(/\s/g, ''), 10);
        
        const surface_unit = $(this).find(".item-card__surface abbr").text();
        //const title = $(this).find(".item-card__title strong").text();
        const code = $(this).find(".item-card__title span").text().trim();
         const url = $(this).find('.item-card__core a').attr('href');
        if (surface_unit == 'm' && surface < 10000 && surface > 20){
        datas.push({
            code,
            price,
            surface,
            surface_unit,
            transaction_type,
            realty_type,
             url
        });}
    });

    return datas;
}

