document.addEventListener("DOMContentLoaded", function () {
	$(document).ready(function () {
		$.get("http://localhost:3030/products", function (products) {
			// Инициализируем переменную для хранения HTML-кода
			var productHTML = '';

			// Для каждого продукта создаем HTML-код
			products.forEach(function (product) {

				var html = `
					<div class="product">
						<div class="product_image"><img src="${product.image}" alt="${product.title}"></div>
						<div class="product_extra product_new"><a href="">${product.productNew}</a></div>
						<div class="product_content">
							<div class="product_title"><a href="${product.link}">${product.title}</a></div>
							<div class="product_price">${product.price}</div>
						</div>
					</div>
		`
				productHTML += html;
			})
			$('.product_grid').prepend(productHTML);
		})
	});
})