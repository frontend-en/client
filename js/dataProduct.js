document.addEventListener("DOMContentLoaded", async () => {

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('productId');

  const savedRating = localStorage.getItem(`rating_${productId}`);

  const container = document.querySelector('.cards');
  const form = document.getElementById('commentForm')
  const stars = document.querySelectorAll('.rating_stars i');

  // Функция для обновления визуального представления звездочек
  const updateStars = (rating) => {
    const stars = document.querySelectorAll('.rating_stars i');
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('filled_star');
        star.classList.remove('empty_star');
      } else {
        star.classList.add('empty_star');
        star.classList.remove('filled_star');
      }
    });
  };
  updateStars()
  if (savedRating) {
    updateStars(parseInt(savedRating));
  }

  // Проходимся по всем звездам и добавляем обработчик события клика
  stars.forEach((star) => {
    // Добавляем обработчик события клика для каждой звезды
    star.addEventListener('click', () => {
      // Получаем рейтинг из атрибута data-rating
      const rating = parseInt(star.getAttribute('data-rating'));
      // Устанавливаем оценку
      setRating(rating);
      updateStars();
      localStorage.setItem(`rating_${productId}`, rating); // Сохраняем рейтинг в localStorage
    });

  });

  // Функция для установки оценки по клику
  const setRating = async (rating) => {
    try {
      await fetch(`http://localhost:3030/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ rating })
      });
      // Обновляем отображение рейтинга на странице
      localStorage.setItem(`rating_${productId}`, rating);
    } catch (error) {
      console.error('Ошибка при отправке рейтинга:', error);
    }
  };

  const getProduct = async () => {
    try {
      const response = await fetch("http://localhost:3030/products");
      if (!response.ok) {
        throw new Error('Ошибка сети');
      }
      const products = await response.json();
      const currentRating = products.find(item => item.id === Number(productId));
      if (currentRating) {
        localStorage.setItem('rateProduct', currentRating.rate);
      }
    } catch (error) {
      console.error('Ошибка при получении продуктов:', error);
    }
  }

  const getCurrentComments = async () => {
    try {
      const response = await fetch(`http://localhost:3030/${productId}`);
      const comments = await response.json();

      comments.forEach(comment => {
        container.insertAdjacentHTML('beforeend', `
                  <div class="card mb-4" style="width: 100%;">
                      <div class="card-body">
                          <h6 class="card-subtitle mb-2 text-muted">${comment.email}</h6>
                          <p class="card-text">${comment.text}</p>
                      </div>
                  </div>
              `);
      });
    } catch (error) {
      console.error('Ошибка при получении комментариев:', error);
    }
  };

  const setComment = async (event, productId) => {

    event.preventDefault();

    const email = document.getElementById('exampleFormControlInput1').value;
    const comment = document.getElementById('exampleFormControlTextarea1').value;

    // Получаем productId из URL страницы
    if (!productId) {
      alert('Не удалось определить ID товара');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3030/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: email,
          comment: comment,
        }),
      });

      if (!response.ok) {
        throw new Error('Не удалось добавить комментарий');
      }
      alert('Комментарий успешно добавлен');
    } catch (error) {
      alert('Ошибка: ' + error.message);
    }
  }

  // вызов функции получения одного товара
  getProduct()

  // вызов функции получения всех комментариев к товару
  getCurrentComments();

  // вызов функции добавления комментария setComment
  form.addEventListener('submit', async (event) => setComment(event, productId));
});
