//carousel

$(document).ready(function () {
  $('.carousel').slick({
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 1,
    prevArrow: '<button class="slick-prev custom-prev"><i class="fa fa-chevron-left"></i></button>',
    nextArrow: '<button class="slick-next custom-next"><i class="fa fa-chevron-right"></i></button>',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
  });
});

//News API
async function fetchNews() {
  try {
      const response = await fetch('https://raw.githubusercontent.com/younginnovations/internship-challenges/master/front-end/news_list.json');
      if (!response.ok) {
          throw new Error('Failed to fetch news');
      }
      const data = await response.json();
      return data.news;
  } catch (error) {
      console.error('Error fetching news:', error);
      return [];
  }
}

let currentPage = 0;
const pageSize = 6;
let newsArticles = [];
let isShowingAllNews = false;

async function displayNews() {
  const newsSection = document.querySelector('.news .cards');

  try {
      if (newsArticles.length === 0) {
          newsArticles = await fetchNews();
      }

      if (!isShowingAllNews) {
          const initialNews = newsArticles.slice(0, pageSize);
          renderNews(newsSection, initialNews);
      } else {
          renderNews(newsSection, newsArticles);
      }

      toggleViewMoreButton();

  } catch (error) {
      console.error('Error displaying news:', error);
  }
}

function renderNews(newsSection, articles) {
  let newsHTML = '';

  articles.forEach((article) => {
      const articleHTML = `
          <div class="card fade-in">
              <img  src="${article.image}" alt="${article.title}">
              <div class="card-content">
                  <h3>${article.title}</h3>
                  <p>${article.content}</p>
                  <a href="${article.link}" target="_blank">Learn more</a>
              </div>
          </div>
      `;
      newsHTML += articleHTML;
  });

  newsSection.innerHTML = newsHTML;
  fadeElementsOnScroll();
}

function fadeElementsOnScroll() {
  const newsCards = document.querySelectorAll('.card');

  const fadeInObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('fade-in');
              observer.unobserve(entry.target);
          }
      });
  }, { threshold: 0.5 });

  newsCards.forEach(card => {
      fadeInObserver.observe(card);
  });
}

function toggleViewMoreButton() {
  const viewMoreButton = document.getElementById('view-more');
  if (isShowingAllNews) {
      viewMoreButton.textContent = 'View Less';
  } else {
      viewMoreButton.textContent = 'View More';
  }
}

document.getElementById('view-more').addEventListener('click', () => {
  isShowingAllNews = !isShowingAllNews;
  displayNews();
});

window.onload = async function() {
  await displayNews();
};
