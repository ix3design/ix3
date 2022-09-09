<script>
const url = "https://api.pipedrive.com/v1";
const rsrc_deals = "/deals";
const rsrc_persons = "/persons";
const api_token = "88ee1e7da5cd5d1cfb5af73f278b985a89c68b53";
let successUrl;
let popupSet;

const getUrlParam = function (param) {
  if (!param) return;
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const paramValue = urlParams.get(param);
  return paramValue;
};

// URL Variables
const utm_source = getUrlParam('utm_source'); // получит параметр "utm_source" из ссылки
const utm_medium = getUrlParam('utm_medium'); // получит параметр "utm_medium" из ссылки
const utm_campaign = getUrlParam('utm_campaign'); // получит параметр "utm_campaign" из ссылки
const utm_content = getUrlParam('utm_content'); // получит параметр "utm_content" из ссылки
const utm_term = getUrlParam('utm_term'); // получит параметр "utm_term" из ссылки


function t396_onSuccess($form) {
  /* Все поля заявки */
  form_fields($form)
}

function t702_onSuccess($form) {
  /* Все поля заявки в попап */
  form_fields($form)
}

function form_fields($form) {
  /* Все поля заявки */
  const arr = {};
  $($form.serializeArray()).each(function (i, el) {
    arr[el.name] = el.value;
  });
  const name = arr.first_name
  const phonefield = arr.phone;
  const phone = phonefield.replace(/[- )(]/g, '');
  const formName = arr['tildaspec-formname'];
  const formId = arr['tildaspec-formid'];
  search_person(phone, name, formName, formId, $form);
}

function search_person(phone, name, formName, formId, $form) {
  const xhrSearch = new XMLHttpRequest();
  xhrSearch.withCredentials = false;
  xhrSearch.addEventListener("readystatechange", function () {
    if (this.readyState === 4 && xhrSearch.status == 200) {
      const objSearch = JSON.parse(xhrSearch.responseText);
      if ((objSearch.data != null && objSearch.data != undefined) && (objSearch.data.items != null && objSearch.data.items != undefined)) {
        if (objSearch.data.items.length > 0) {
          const person_id = objSearch.data.items[0].item.id;
          const person_name = objSearch.data.items[0].item.name;
          search_deal(person_id, person_name, formName, formId, $form);
        } else {
          create_person(phone, name, formName, formId, $form);
        }
      }
    }
  });

  xhrSearch.open("GET", url + rsrc_persons + "/search?term=" + phone + "&fields=phone&" + "api_token" + "=" + api_token, true);
  xhrSearch.setRequestHeader("Accept", "application/json");
  xhrSearch.send();
}

function search_deal(person_id, person_name, formName, formId, $form) {

  const xhrSearchDeal = new XMLHttpRequest();
  xhrSearchDeal.withCredentials = false;
  xhrSearchDeal.addEventListener("readystatechange", function (deal_id, deal_stage) {
    if (this.readyState === 4 && xhrSearchDeal.status == 200) {
      const objSearchDeal = JSON.parse(xhrSearchDeal.responseText);
      if ((objSearchDeal.data != null && objSearchDeal.data != undefined) && (objSearchDeal.data.items != null && objSearchDeal.data.items != undefined)) {
        if (objSearchDeal.data.items.length > 0) {
          deal_id = objSearchDeal.data.items[0].item.id;
          deal_stage = objSearchDeal.data.items[0].item.stage.id;
          if (deal_stage >= 1 && deal_stage < 4) {
            update_deal(deal_id, formName, formId, $form);
          } else {
            update_formname(deal_id, formName, formId, $form);
          }
        } else {
          create_deal_new(person_id, person_name, formName, formId, $form);
        }
      }
    }
  });

  xhrSearchDeal.open("GET", url + rsrc_deals + "/search?" + "term=" + person_name + "&person_id=" + person_id + "&" + "api_token" + "=" + api_token, true);
  xhrSearchDeal.setRequestHeader("Accept", "application/json");
  xhrSearchDeal.send();
}

function create_person(phone, name, formName, formId, $form) {
  const jsonStringPerson = JSON.stringify({
    name: name,
    phone: phone
  });

  const xhrPerson = new XMLHttpRequest();
  xhrPerson.withCredentials = false;
  xhrPerson.onreadystatechange = function () {
    if (xhrPerson.readyState == 4 && xhrPerson.status == 201) {
      const obj = JSON.parse(xhrPerson.responseText);
      const person_id = obj.data.id;
      create_deal(name, person_id, formName, formId, $form)
    } else {
      return;
    }
  }
  xhrPerson.open("POST", url + rsrc_persons + "?" + "api_token" + "=" + api_token, true);
  xhrPerson.setRequestHeader("Content-type", "application/json");
  xhrPerson.send(jsonStringPerson);
}

function create_deal(name, person_id, formName, formId, $form) {
  const jsonStringDeal = JSON.stringify({
    title: name,
    pipeline_id: 1,
    stage_id: 4,
    person_id: person_id,
    'b848412df38a1f928cae406df5b1b878b042d7a8': utm_source,
    'c731b903ce987cf7b2593292a229371a1a53a075': utm_medium,
    '1a2d8d2c9cc43b8a8d26df807304f7267dccbdf2': utm_campaign,
    '220341ff29bc77f3cdbf65f29476589eaadc602d': utm_content,
    '0f16288d0c674d2287ea13eb2bc53a6d1fc99092': utm_term,
    '705d978dd0a77b6645dae70265c88d0640811478': formName,
    status: open
  });

  const xhrDeal = new XMLHttpRequest();
  xhrDeal.withCredentials = false;
  xhrDeal.open("POST", url + rsrc_deals + "?" + "api_token" + "=" + api_token, true);
  xhrDeal.setRequestHeader("Content-type", "application/json");
  xhrDeal.send(jsonStringDeal);
  xhrDeal.onload = function () {
    if (xhrDeal.response) {
      /* Какие-то действия, если данные дошли успешно */

      /* Переадресация на страницу успеха */
      successUrl = $form.attr('data-success-url');
      popupSet = $form.attr('data-success-popup');
      if (successUrl === undefined || successUrl == null || successUrl.length <= 0) {
        if (formId === form417624778 || form418341956 || form418342107 || form418342185 || form405662857 || form418385839 || form418385543 || form418385545 || form418385547) {
          const hiddenForm = document.querySelector('#' + formId + ' .t-form__inputsbox');
          hiddenForm.classList.add('t702__inputsbox_hidden');
        } else {
          return
        }
      } else {
        window.location.href = successUrl;
      }
    }
  }
}

function create_deal_new(person_id, person_name, formName, formId, $form) {
  const jsonStringDeal = JSON.stringify({
    title: person_name,
    pipeline_id: 1,
    stage_id: 4,
    person_id: person_id,
    'b848412df38a1f928cae406df5b1b878b042d7a8': utm_source,
    'c731b903ce987cf7b2593292a229371a1a53a075': utm_medium,
    '1a2d8d2c9cc43b8a8d26df807304f7267dccbdf2': utm_campaign,
    '220341ff29bc77f3cdbf65f29476589eaadc602d': utm_content,
    '0f16288d0c674d2287ea13eb2bc53a6d1fc99092': utm_term,
    '705d978dd0a77b6645dae70265c88d0640811478': formName,
    status: open
  });

  const xhrDeal = new XMLHttpRequest();
  xhrDeal.withCredentials = false;
  xhrDeal.open("POST", url + rsrc_deals + "?" + "api_token" + "=" + api_token, true);
  xhrDeal.setRequestHeader("Content-type", "application/json");
  xhrDeal.send(jsonStringDeal);
  xhrDeal.onload = function () {
    if (xhrDeal.response) {
      /* Какие-то действия, если данные дошли успешно */

      /* Переадресация на страницу успеха */
      successUrl = $form.attr('data-success-url');
      popupSet = $form.attr('data-success-popup');
      if (successUrl === undefined || successUrl == null || successUrl.length <= 0) {
        if (formId === form417624778 || form418341956 || form418342107 || form418342185 || form405662857 || form418385839 || form418385543 || form418385545 || form418385547) {
          const hiddenForm = document.querySelector('#' + formId + ' .t-form__inputsbox');
          hiddenForm.classList.add('t702__inputsbox_hidden');
        } else {
          return
        }
      } else {
        window.location.href = successUrl;
      }
    }
  }
}

function update_deal(deal_id, formName, formId, $form) {
  const jsonStringUpdateDeal = JSON.stringify({
    stage_id: 4,
    '705d978dd0a77b6645dae70265c88d0640811478': formName
  });
  const xhrDeal = new XMLHttpRequest();
  xhrDeal.withCredentials = false;
  xhrDeal.open("PUT", url + rsrc_deals + "/" + deal_id + "?" + "api_token" + "=" + api_token, true);
  xhrDeal.setRequestHeader("Content-type", "application/json");
  xhrDeal.send(jsonStringUpdateDeal);
  xhrDeal.onload = function () {
    if (xhrDeal.response) {
      /* Какие-то действия, если данные дошли успешно */

      /* Переадресация на страницу успеха */
      successUrl = $form.attr('data-success-url');
      popupSet = $form.attr('data-success-popup');
      if (successUrl === undefined || successUrl == null || successUrl.length <= 0) {
        if (formId === form417624778 || form418341956 || form418342107 || form418342185 || form405662857 || form418385839 || form418385543 || form418385545 || form418385547) {
          const hiddenForm = document.querySelector('#' + formId + ' .t-form__inputsbox');
          hiddenForm.classList.add('t702__inputsbox_hidden');
        } else {
          return
        }
      } else {
        window.location.href = successUrl;
      }
    }
  }
}

function update_formname(deal_id, formName, formId, $form) {
  const jsonStringUpdateDeal = JSON.stringify({
    '705d978dd0a77b6645dae70265c88d0640811478': formName
  });
  const xhrDeal = new XMLHttpRequest();
  xhrDeal.withCredentials = false;
  xhrDeal.open("PUT", url + rsrc_deals + "/" + deal_id + "?" + "api_token" + "=" + api_token, true);
  xhrDeal.setRequestHeader("Content-type", "application/json");
  xhrDeal.send(jsonStringUpdateDeal);
  xhrDeal.onload = function () {
    if (xhrDeal.response) {
      /* Какие-то действия, если данные дошли успешно */

      /* Переадресация на страницу успеха */
      successUrl = $form.attr('data-success-url');
      if (successUrl === undefined || successUrl == null || successUrl.length <= 0) {
        if (formId === form417624778 || form418341956 || form418342107 || form418342185 || form405662857 || form418385839 || form418385543 || form418385545 || form418385547) {
          const hiddenForm = document.querySelector('#' + formId + ' .t-form__inputsbox');
          hiddenForm.classList.add('t702__inputsbox_hidden');
        } else {
          return
        }
      } else {
        window.location.href = successUrl;
      }
    }
  }
}
</script>