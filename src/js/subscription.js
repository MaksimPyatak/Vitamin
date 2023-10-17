import "./modules/cart.js";
import { db, signOutFunc, returnAuthUser, } from "./modules/firebase.js";
import { changeBackgrounHeader } from "./utilits/function.js";
import { doc, getDoc, updateDoc, } from "firebase/firestore";

const signOutLink = document.querySelector('.item__sign-out');

signOutLink.addEventListener('click', signOutFunc);

changeBackgrounHeader();

const user = await returnAuthUser();
const userId = user.uid;
let subscriptions = {};

try {
   const docSnapshot = await getDoc(doc(db, 'users', userId));
   if (docSnapshot.exists()) {
      subscriptions = docSnapshot.data().subscriptions;
   } else {
      console.log('Документ не існує');
   }
} catch (error) {
   console.log(error);
}

const subscriptionBlock = document.querySelector('.content__subscriptions');

for (const productId in subscriptions) {
   if (Object.hasOwnProperty.call(subscriptions, productId)) {
      const subscription = subscriptions[productId];
      const subscriptionCard = createSubscriptionCard(subscription, productId);
      subscriptionBlock.appendChild(subscriptionCard);
      const imgBlock = subscriptionCard.querySelector('.subscription__img-block');
      imgBlock.style.background = subscription.bg_color;
      const productType = subscriptionCard.querySelector('.subscription__prouct-type');
      productType.style.color = subscription.text_color;
      const btn = subscriptionCard.querySelector('.subscription__unsubscribe-btn');
      btn.addEventListener('click', (e) => unsubscribe(e, subscriptionCard))
   }
}
async function unsubscribe(e, subscriptionCard) {
   const productId = e.target.dataset.uid;
   delete subscriptions[productId];
   try {
      await updateDoc(doc(db, 'users', userId), { subscriptions: subscriptions });
      subscriptionCard.remove();
   } catch (error) {
      console.error(error);
   }
}

function createSubscriptionCard(subscription, productId) {
   const date = getCastomFormatDate(subscription.date);
   const cardInner = `   
     <div class="subscription__img-block">
       <picture>
         <source srcset="${subscription.webP}" type="image/webp" />
         <img src="${subscription.png}" alt="${subscription.name}" class="subscription__img" />
       </picture>
     </div>
     <div class="subscription__content">
       <div class="subscription__prouct-type">${subscription.nameType}</div>
       <div class="subscription__title-block">
         <div class="subscription__title">${subscription.count} x ${subscription.name}</div>
         <div class="subscription__price">$${(+subscription.amount).toFixed(2)}</div>
       </div>
       <div class="subscription__unsubscribe-block">
         <div class="subscription__delivery-info">
           <div class="subscription__shipment">Shipment every ${subscription.autoshipPeriodicity} days</div>
           <div class="subscription__next-delivery">Next delivery: ${date}</div>
         </div>
         <button class="subscription__unsubscribe-btn" data-uid ="${productId}">Unsubscribe</button>
       </div>
     </div>
   `;
   const subscriptionCard = document.createElement('div');
   subscriptionCard.classList.add('content__subscription', 'subscription');
   subscriptionCard.id = productId;
   subscriptionCard.innerHTML = cardInner;
   return subscriptionCard
}

function getCastomFormatDate(timestamp) {
   const date = new Date(timestamp);
   const options = { month: 'short', year: 'numeric' };
   const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

   function getDaySuffix(day) {
      //if (day >= 11 && day <= 13) {
      //   return 'th';
      //}
      const lastDigit = day % 10;
      switch (lastDigit) {
         case 1:
            return 'st';
         case 2:
            return 'nd';
         case 3:
            return 'rd';
         default:
            return 'th';
      }
   }

   const daySuffix = getDaySuffix(date.getDate());

   const formattedDateWithSuffix = `${date.getDate()}${daySuffix} ${formattedDate}`;
   return formattedDateWithSuffix
}