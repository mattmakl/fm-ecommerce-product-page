
const quantity = document.querySelector('.cart-count');
const mobileNav = document.querySelector('.nav-mobile');
const lightbox = document.querySelector('.lightbox-bg');
const selectedImg = document.querySelector('.product-image-selected');
const selectedLightboxImg = document.querySelector('.lightbox-product-image-selected');
document.querySelector('.product-image-selected');
let totalQty = 0;
let currentQty = 0;
let cartItems = [];
let currentImg = 0;

const toggleMobileNav = () => {
    
    mobileNav.classList.toggle('active')
    mobileNav.setAttribute('aria-hidden',mobileNav.classList.contains('active')?false:true)


    // if(mobileNav.classList.contains('active')){
    //     mobileNav.classList.remove('active');
    //     mobileNav.setAttribute('aria-hidden',true)
    // } else {
    //     mobileNav.classList.add('active');
    //     mobileNav.setAttribute('aria-hidden',true)
    // }
}

// update main image
const toggleImages = (num) => {
    currentImg = num;
    selectedImg.src = `./images/image-product-${num+1}.jpg`
    document.querySelectorAll(".thumbnail").forEach((thumb, i) => {
        num === i?thumb.classList.add('selected'):thumb.classList.remove('selected');
    });
}

// update lightbox image
const toggleLighboxImages = (num) => {
    currentImg = num;
    selectedLightboxImg.src = `./images/image-product-${num+1}.jpg`
    document.querySelectorAll(".lightbox-thumbnail").forEach((thumb, i) => {
        num === i?thumb.classList.add('selected'):thumb.classList.remove('selected');
    });
}

// show/hide lightbox
const toggleLightbox = () => {
    lightbox.classList.toggle('hidden');
    lightbox.setAttribute('aria-hidden',lightbox.classList.contains('hidden')?true:false);
}

document.querySelectorAll(".photo-scroll-buttons button").forEach(
    button => button.addEventListener('click',(e) => {
        if(e.target.id.includes('next')){
            toggleImages(currentImg === 3?0:currentImg + 1)
        }

        if(e.target.id.includes('prev')){
            toggleImages(currentImg === 0?3:currentImg - 1)
        }
}))

document.querySelectorAll(".lightbox-scroll-buttons button").forEach(
    button => button.addEventListener('click',(e) => {
        if(e.target.id.includes('next')){
            toggleLighboxImages(currentImg === 3?0:currentImg + 1);
        }
        if(e.target.id.includes('prev')){
            toggleLighboxImages(currentImg === 0?3:currentImg - 1);
        }
}))

document.querySelectorAll(".thumbnail").forEach(
    (button, i) => button.addEventListener('click',(e) => {
        toggleImages(i)
    })
)

document.querySelectorAll(".lightbox-thumbnail").forEach(
    (button, i) => button.addEventListener('click',(e) => {
        toggleLighboxImages(i)
    })
)

document.getElementById('close-lightbox').addEventListener('click',toggleLightbox)

selectedImg.addEventListener('click',() => {
    selectedLightboxImg.src = selectedImg.src;
    document.querySelectorAll(".lightbox-thumbnail").forEach((thumb, i) => {
        currentImg === i?thumb.classList.add('selected'):thumb.classList.remove('selected');
    });
    
    toggleLightbox();
})

const addToCart = (img,name,price,qty) => {

// check if item is in cart, if not push to cart array, else update qty

    let prodlist = cartItems.map(item=>item.name);

    if(prodlist.indexOf(name) === -1) {
        cartItems.push({
            'img':img,
            'name':name,
            'price':price,
            'qty':qty
        });
        totalQty += currentQty
    } else {
        const currIndex = prodlist.indexOf(name);
        cartItems[currIndex] = {...cartItems[currIndex],'qty':cartItems[currIndex].qty + currentQty};
        totalQty = cartItems[currIndex].qty;
    }
    
    document.documentElement.style.setProperty('--Cart-qty', `'${totalQty}'`);

    document.querySelector('.cart-summary').classList.remove('hidden'); // show cart count in header
    quantity.textContent = 0;
    currentQty = 0;
    updateCart();
    document.querySelector('#delete-item-btn').addEventListener('click', e => {
        let itemName = e.target.previousElementSibling.firstElementChild.textContent
        cartItems = cartItems.filter(item => item.name != itemName)
        updateCart();
    });  
}

const updateCart = () => {
    if(cartItems.length === 0){
        document.querySelector('.cart-summary-body').textContent = 'Your cart is empty.'
        document.querySelector('.cart-summary').classList.add('hidden')
        totalQty = 0;
        document.documentElement.style.setProperty('--Cart-qty', `'${totalQty}'`);
    } else {
        let temp = ''
        cartItems.forEach(item => temp += getCartHtml(item))  
        document.querySelector('.cart-summary-body').innerHTML = `
        ${temp}
        <button id="checkout-btn">Checkout</button>
        ` 
    }
}

// populate cart summary
const getCartHtml = (item) => {
    return `
        <div class="item-container">
            <img src="${item.img}"/>
            <div>
                <p>${item.name}<p>
                <p>${item.price} x ${item.qty} <b>$${(+item.price.replace("$","") * item.qty).toFixed(2)}</b></p>
            </div>
            <button id="delete-item-btn" aria-label="Delete item from cart"></button>
        </div>
    `
}

document.querySelector('.nav-mobile-hamburger').addEventListener('click',toggleMobileNav);
document.querySelector('.nav-mobile-close').addEventListener('click',toggleMobileNav);
   
document.getElementById("add-to-cart").addEventListener('click',()=>{
    const img =  "./images/image-product-1-thumbnail.jpg";
    const name = document.querySelector('h1').textContent;
    const price = document.querySelector('.current-price').textContent;
    currentQty > 0?addToCart(img, name, price, currentQty):null;
});

document.querySelectorAll('.cart-quantity img').forEach(element => {
    element.addEventListener('click',e => {
        currentQty+=e.target.className.includes('plus')?1:currentQty===0?0:-1
        quantity.textContent = currentQty;
    })
})