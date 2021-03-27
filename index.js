const fetch = require("isomorphic-unfetch")
const querystring = require("querystring")

/*
  * URL для RestAPI
  */
const URL = 'https://api.yclients.com/api/v1/';

/*
 * Методы используемые в API
 */
const METHOD_GET = 'GET';
const METHOD_POST = 'POST';
const METHOD_PUT = 'PUT';
const METHOD_DELETE = 'DELETE';

class YclientsApi {
  constructor({ tokenPartner = null }) {

    /**
     * Токен доступа для авторизации партнёра
     *
     * @var string
     * @access private
     */

    this.tokenPartner = tokenPartner
  }


  requestCurl(endpoint = "", config = {}) {

    let url = URL + endpoint
     
    console.log(url, config)
    return fetch(url, config).then(r => {

      
      console.log(r)
      if (r.ok) {
        console.log(r.json())
        return r.json()
      }
      // throw new Error(r)
    })

  }

  request($url, parameters, $method = 'GET', $auth = true) {


    console.log(parameters)
    let headers = { 
      'Content-Type': 'application/json', 
      'Accept': 'application/vnd.yclients.v2+json' 
    }

    if ($auth) {
      if (!this.tokenPartner) {
        throw new Error('Не указан токен партнёра');
      }

      headers = {
        ...headers,
        'Authorization': `Bearer ${this.tokenPartner}`

        //.concat($auth ? `, User ${$auth}` : '')
      }
    }

    let options = {
      'method': $method,
      'body': parameters,
      headers,
    }

    // const additionalParams = $parameters ? "?" + querystring.stringify($parameters) : ""
    let endpoint = $url 
    // + additionalParams


    console.log('head ', headers)
    return this.requestCurl(endpoint, options);

  }


  /**
   * Получаем токен пользователя по логину-паролю
   *
   * @param string $login
   * @param string $password
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/0/0/0
   * @throws YclientsException
   */

  getAuth(credentials) {
    return this.request('auth', credentials, METHOD_POST);
  }

  /**
    * Получаем настройки формы бронирования
    *
    * @param integer $id
    * @return array
    * @access public
    * @see http://docs.yclients.apiary.io/#reference/-/0/0
    * @throws YclientsException
    */
  getBookform($id) {
    return this.request(`bookform/${$id}`);
  }

  /**
     * Получаем параметры интернационализации
     *
     * @param string $locale - ru-RU, lv-LV, en-US, ee-EE, lt-LT, de-DE, uk-UK
     * @return array
     * @access public
     * @see http://docs.yclients.apiary.io/#reference/-/1/0
     * @throws YclientsException
     */
  getI18n($locale = 'ru-RU') {
    return this.request(`i18n/${$locale}`);
  }
  /**
    * Получить список услуг доступных для бронирования
    *
    * @param integer $companyId
    * @param integer $staffId - ID сотрудника. Фильтр по идентификатору сотрудника
    * @param \DateTime $datetime - дата (в формате iso8601). Фильтр по дате
    *                              бронирования услуги (например '2005-09-09T18:30')
    * @param array $serviceIds - ID услуг. Фильтр по списку идентификаторов уже
    *                            выбранных (в рамках одной записи) услуг. Имеет
    *                            смысл если зада фильтр по мастеру и дате.
    * @param array $eventIds - ID акций. Фильтр по списку идентификаторов уже выбранных
    *                          (в рамках одной записи) акций. Имеет смысл если зада
    *                          фильтр по мастеру и дате.
    * @return array
    * @access public
    * @see http://docs.yclients.apiary.io/#reference/-/2/0
    * @throws YclientsException
    */

  getBookServices(
    $companyId,
    $staffId = null,
    $datetime = null,
    $serviceIds = null,
    $eventIds = null
  ) {
    $parameters = [];

    if ($staffId !== null) {
      $parameters['staff_id'] = $staffId;
    }

    if ($datetime !== null) {
      $parameters['datetime'] = new Date($datetime) // '05 October 2011 14:48 UTC'  -> format(\DateTime:: ISO8601);
    }

    if ($serviceIds !== null) {
      $parameters['service_ids'] = $serviceIds;
    }

    if ($eventIds !== null) {
      $parameters['event_ids'] = $eventIds;
    }

    return this.request(`book_services/${$companyId}`, $parameters);
  }
}

const api = new YclientsApi({
  tokenPartner: "5uuwjsb8pfzf54ddkmdm"
})

api
.getAuth({"login": "amatveevdev9@gmail.com", "password": "txxta6"})
.then(data => console.log(data))
.catch((error) => {
  console.log(error.stack)
});
