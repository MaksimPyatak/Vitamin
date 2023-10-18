const bm = document.querySelector('.header__burger');
const body = document.querySelector('body');
const menu = document.querySelector('.header__menu');
const crissCross = document.querySelector('.menu__criss-cross');

bm.addEventListener('click', () => {
   body.classList.add('_lock');
   menu.classList.add('header__menu--active');
})
crissCross.addEventListener('click', () => {
   body.classList.remove('_lock');
   menu.classList.remove('header__menu--active');
})

const profileIcon = document.querySelector('.menu__profile-icon');
const profileMenu = document.querySelector('.profile-menu');
const profileArrow = document.querySelector('.profile-menu__arrow');
profileIcon.addEventListener('click', () => {
   profileMenu.classList.add('menu__profile-menu--active');
});
profileArrow.addEventListener('click', () => {
   profileMenu.classList.remove('menu__profile-menu--active');
});

const mainList = document.querySelector('.menu__main-list');//!!

const shopItem = document.querySelector('.main-item__shop');
const shopArrow = document.querySelector('.shop-menu__arrow');
const shopMenu = document.querySelector('.menu__shop-menu');
shopItem.addEventListener('click', () => {
   shopMenu.classList.add('menu__shop-menu--active');
});
shopArrow.addEventListener('click', () => {
   shopMenu.classList.remove('menu__shop-menu--active');
});

const informationItem = document.querySelector('.main-item__information');
const informationArrow = document.querySelector('.information-menu__arrow');
const informationMenu = document.querySelector('.menu__information-menu');
informationItem.addEventListener('click', () => informationMenu.classList.add('menu__information-menu--active'));
informationArrow.addEventListener('click', () => {
   informationMenu.classList.remove('menu__information-menu--active');
});