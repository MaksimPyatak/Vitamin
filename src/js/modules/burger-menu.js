import { getScrollbarWidth } from "../utilits/function.js";

const header = document.querySelector('.header');
const bm = document.querySelector('.header__burger');
const body = document.querySelector('body');
const wrapper = document.querySelector('.wrapper');
const menu = document.querySelector('.header__menu');
const crissCross = document.querySelector('.menu__criss-cross');
let wrapperMaxWidth = null;
let headerMaxWidth = null;

bm.addEventListener('click', () => {
   menu.style.display = 'block';
   //document.body.style.paddingRight = `${getScrollbarWidth()}px`;
   //header.style.paddingRight = `${getScrollbarWidth()}px`;
   wrapperMaxWidth = wrapper.style.maxWidth;
   header.style.maxWidth = `${getScrollbarWidth()}px`;
   wrapper.style.maxWidth = `${getScrollbarWidth()}px`;
   body.classList.add('_lock');
   window.setTimeout(() => {
      menu.classList.add('header__menu--active');
   }, 0);
})
crissCross.addEventListener('click', () => {
   //document.body.style.paddingRight = '0px';
   //header.style.paddingRight = '0px';
   header.style.maxWidth = headerMaxWidth == '' ? '' : `${headerMaxWidth}px`;
   wrapper.style.maxWidth = wrapperMaxWidth == '' ? '' : `${wrapperMaxWidth}px`;
   window.setTimeout(() => menu.style.display = 'none', 300);
   body.classList.remove('_lock');
   menu.classList.remove('header__menu--active');
})

const profileIcon = document.querySelector('.menu__profile-icon');
const profileMenu = document.querySelector('.profile-menu');
const profileArrow = document.querySelector('.profile-menu__arrow');
profileIcon.addEventListener('click', () => {
   profileMenu.style.display = 'block';
   window.setTimeout(() => profileMenu.classList.add('menu__profile-menu--active'), 0);
});
profileArrow.addEventListener('click', () => {
   //profileMenu.style.display = 'none';
   profileMenu.classList.remove('menu__profile-menu--active');
   window.setTimeout(() => profileMenu.style.display = 'none', 300);
});

const mainList = document.querySelector('.menu__main-list');//!!

const shopItem = document.querySelector('.main-item__shop');
const shopArrow = document.querySelector('.shop-menu__arrow');
const shopMenu = document.querySelector('.menu__shop-menu');
shopItem.addEventListener('click', () => {
   shopMenu.style.display = 'block';
   window.setTimeout(() => shopMenu.classList.add('menu__shop-menu--active'), 0);
});
shopArrow.addEventListener('click', () => {
   shopMenu.classList.remove('menu__shop-menu--active');
   window.setTimeout(() => shopMenu.style.display = 'none', 300);
});

const informationItem = document.querySelector('.main-item__information');
const informationArrow = document.querySelector('.information-menu__arrow');
const informationMenu = document.querySelector('.menu__information-menu');
informationItem.addEventListener('click', () => {
   informationMenu.style.display = 'block';
   window.setTimeout(() => informationMenu.classList.add('menu__information-menu--active'), 0);
});
informationArrow.addEventListener('click', () => {
   //informationMenu.style.display = 'none';
   informationMenu.classList.remove('menu__information-menu--active');
   window.setTimeout(() => informationMenu.style.display = 'none', 300);
});