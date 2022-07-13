

<script>
  {{#if product.id}}
    window.dataLayer.push({
      'productPrice': '{{product.price.without_tax.value}}',
       'productId': '{{product.id}}',
         'productName': '{{product.title}}'
    });
  {{/if}}
</script>


<script>
var Products = [];
var cartProducts = [];
var orderProducts = [];
var checkoutProducts = [];
var customerData = {};
var orderTotal = 0;
var PageType = '{{page_type}}';
var isCart = '{{cart}}' ? true:false;
var isOrder = '{{order}}' ? true:false;
var isCustomer = '{{customer}}' ? true:false;
var isCheckout = window.location.pathname === '/checkout';
var language = window.navigator.userLanguage || window.navigator.language;
var category = '{{category.name}}';
var subcategory = '{{category.subcategories.name}}';

function addDataToDataLayer(eventName) {
    window.dataLayer.push({
        'event': eventName,
        'cart_products': cartProducts,
        'order_products': orderProducts,
        'products':Products,
        'order_total': orderTotal,
        'checkout_products': checkoutProducts,
        'customer': customerData,
        'isCart': isCart,
        'isOrder': isOrder,
        'isCheckout': isCheckout,
        'isCustomer': isCustomer,
        'pageTypeCG':PageType,
        'localeCD':language,
        'categoryCG':category,
        'subCategoryCG':subcategory,
        'products':Products,
    });
}

function requestUserData(eventName) {
    if (document.querySelectorAll('.customerView > .customerView-body').length) {
        customerData.email = document.querySelectorAll('.customerView > .customerView-body')[0].textContent;
    }

    addDataToDataLayer(eventName);
}


{{#if customer}}
    customerData.id = '{{customer.id}}';
    customerData.name = '{{customer.name}}';
    customerData.email = '{{customer.email}}';
    customerData.phone = '{{customer.phone}}';
  
  window.dataLayer.push({
      'userIDCD': '{{customer.id}}', 'loginStatusCD':'Logged-in'
    });
{{/if}}
{{#unless customer}}
  window.dataLayer.push({
'loginStatusCD':'Guest'
    });
{{/unless}}
  
if (isCheckout) {
    /* get the current cart contents */
    const Http = new XMLHttpRequest();
    const url = '/api/storefront/carts';
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4) {
            var response = JSON.parse(Http.responseText);
            var cart = response[0].lineItems.physicalItems;
            for (var i = 0; i < cart.length; i++) {
                var product = cart[i];
                checkoutProducts.push({
                    'id': product.productId,
                    'name': product.name,
                    'sku': product.sku
                });
            }
            addDataToDataLayer('data_layer_ready');
            addDataToDataLayer('checkout');

        }
    }
    (e) => {
        console.log(Http.responseText);
    }

    window.addEventListener("click", function (event) {
        var id = event.target.id;
        if (id === 'checkout-customer-continue') {
            requestUserData('checkout_step_2');
        }
        if (id === 'checkout-shipping-continue') {
            requestUserData('checkout_step_3');
        }
        if (id === 'checkout-billing-continue') {
            requestUserData('checkout_step_4');
        }
        if (id === 'checkout-payment-continue') {
            requestUserData('checkout_step_5');
        }
    });
} else {
    {{#if cart}}
        {{#forEach cart.items}}
            cartProducts.push({
                'name': '{{name}}',
                'id': '{{id}}',
                'sku': '{{sku}}'
            });
        {{/forEach}}
    {{/if}}
        
    {{#if order}}
        {{#if order.total}}
            orderTotal = parseFloat('{{order.total.value}}');
        {{/if}}

        {{#forEach order.items}}
            orderProducts.push({
                'name': '{{name}}',
                'id': '{{order_product_id}}',
                'sku': '{{sku}}'
            });
        {{/forEach}}
    {{/if}}

    addDataToDataLayer('data_layer_ready');
}
    
</script>
<script>
     {{#if page_type '===' 'product'}}
     	window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({'event':"view_item",
            currency: "{{currency_selector.active_currency_code}}",
            value: {{#or customer (unless theme_settings.restrict_to_login)}}{{#if product.price.with_tax}}parseFloat({{product.price.with_tax.value}}){{else}}parseFloat({{product.price.without_tax.value}}){{/if}}{{else}}"{{lang 'common.login_for_pricing'}}"{{/or}},
            items: [
                {
                    item_id: "{{#if product.sku}}{{product.sku}}{{else}}{{product.id}}{{/if}}",
                    item_name: "{{product.title}}",
                    currency: "{{currency_selector.active_currency_code}}",
                    discount: parseFloat({{product.price.saved.value}}),
                    item_brand: "{{product.brand.name}}",
                    price: {{#or customer (unless theme_settings.restrict_to_login)}}{{#if product.price.with_tax}}parseFloat({{product.price.with_tax.value}}){{else}}parseFloat({{product.price.without_tax.value}}){{/if}}{{else}}"{{lang 'common.login_for_pricing'}}"{{/or}},
                    quantity: 1,
                    availability:'{{product.availability}}',
                    {{#each product.category}}{{#if @first}}item_category:"{{this}}"{{else}},item_category{{@index}}:"{{this}}"{{/if}}{{/each}}
                }
            ]
        });
                            {{/if}}
                              

      
{{#if page_type '===' 'cart'}}
        window.dataLayer.push({"event": "view_cart",
            currency: "{{currency_selector.active_currency_code}}",
            value: parseFloat({{cart.sub_total.value}}),
            items: [
                {{#each cart.items}}
                {
                    item_id: "{{#if sku}}{{sku}}{{else}}{{product_id}}{{/if}}",
                    item_name: "{{name}}",
                    item_brand: "{{brand.name}}",                    
                    price: parseFloat({{price.value}}),
                    quantity: parseInt({{quantity}})
                },
                {{/each}}                                        
        ]});
    {{/if}}
      
      {{#if page_type '===' 'login' }}
        document.querySelector("form[action='/login.php?action=check_login']").addEventListener("submit", function () {
            window.dataLayer.push({"event": "login", method: "Website" });
        });   
    {{/if}}
      
      {{#if page_type '===' 'createaccount_thanks' }}
        window.dataLayer.push({"event": "sign_up", 
            method: "Website"
        });
    {{/if}}
</script>
<script>
    {{#if page_type '===' 'category'}}
        window.dataLayer.push({"event": "view_items_list",
            currency: "AUD",
            value: parseFloat({{cart.sub_total.value}}),
            impressions: [
                {{#each category.products}}
                {
                    item_id: '{{id}}',
                    item_name: '{{name}}',
                    price:{{#if price.with_tax}}parseFloat({{price.with_tax.value}}){{else}}parseFloat({{price.without_tax.value}}){{/if}},
                },
                {{/each}}                                        
        ]});
    {{/if}} 
</script>