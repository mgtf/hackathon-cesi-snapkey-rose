const cheerio = require('cheerio');

module.exports = {
    parse_result_page
};

function parse_result_page(raw_html) {
    const $ = cheerio.load(raw_html);
    const datas = [];

    $("ul.list-cards li").each(function() {
        const price = $(this).find(".item-card__price strong").text();
        if (price === '') {
            return;
        }

        const surface = $(this).find(".item-card__surface strong").text();
        const surface_unit = $(this).find(".item-card__surface abbr").text();
        const title = $(this).find(".item-card__title strong").text();
        const code = $(this).find(".item-card__title span").text().trim();
        const url = $(this).find('.item-card__core a').attr('href');

        datas.push({
            price,
            surface,
            surface_unit,
            title,
            code,
            url
        });
    });

    return datas;
}
