const fetch = require('node-fetch');
const querystring = require("querystring")

const { format } = require('date-fns')

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

  requestCurl = async (endpoint = "", config = {}) => {
    let url = URL + endpoint

    const response = await fetch(url, config);
    const data = await response.json();

    return data
  }

  request(url, parameters, method = 'GET', auth = true) {
    let headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.yclients.v2+json'
    }

    if (auth) {
      if (!this.tokenPartner) {
        throw new Error('Не указан токен партнёра');
      }

      headers = {
        ...headers,
        'Authorization': `Bearer ${this.tokenPartner}`

        //.concat( auth ? `, User  { auth}` : '')
      }
    }

    let options = {
      'method': method,
      headers,
    }

    const additionalParams = parameters ? "?" + querystring.stringify(parameters) : ""

    let endpoint = url

    if (method === METHOD_GET) {
      endpoint = endpoint + additionalParams
    } else {
      options = {
        ...options,
        'body': JSON.stringify(parameters),
      }
    }
    return this.requestCurl(endpoint, options);
  }


  /**
   * Получаем токен пользователя по логину-паролю
   *
   * @param string  login
   * @param string  password
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
    * @param integer  id
    * @return array
    * @access public
    * @see http://docs.yclients.apiary.io/#reference/-/0/0
    * @throws YclientsException
    */
  getBookform(id) {
    return this.request(`bookform/${id}`);
  }

  /**
     * Получаем параметры интернационализации
     *
     * @param string  locale - ru-RU, lv-LV, en-US, ee-EE, lt-LT, de-DE, uk-UK
     * @return array
     * @access public
     * @see http://docs.yclients.apiary.io/#reference/-/1/0
     * @throws YclientsException
     */
  getI18n(locale = 'ru-RU') {
    return this.request(`i18n/${locale}`);
  }
  /**
    * Получить список услуг доступных для бронирования
    *
    * @param integer  companyId
    * @param integer  staffId - ID сотрудника. Фильтр по идентификатору сотрудника
    * @param   datetime - дата (в формате iso8601). Фильтр по дате
    *                              бронирования услуги (например '2005-09-09T18:30')
    * @param array  serviceIds - ID услуг. Фильтр по списку идентификаторов уже
    *                            выбранных (в рамках одной записи) услуг. Имеет
    *                            смысл если зада фильтр по мастеру и дате.
    * @param array  eventIds - ID акций. Фильтр по списку идентификаторов уже выбранных
    *                          (в рамках одной записи) акций. Имеет смысл если зада
    *                          фильтр по мастеру и дате.
    * @return array
    * @access public
    * @see http://docs.yclients.apiary.io/#reference/-/2/0
    * @throws YclientsException
    */

  getBookServices(
    companyId,
    staffId = null,
    datetime = null,
    serviceIds = null,
    eventIds = null
  ) {
    let parameters = {};

    if (staffId !== null) {
      parameters['staff_id'] = staffIBd;
    }

    if (datetime !== null) {
      parameters['datetime'] = new Date(datetime) // '05 October 2011 14:48 UTC'  -> format(:: ISO8601);
    }

    if (serviceIds !== null) {
      parameters['service_ids'] = serviceIds;
    }

    if (eventIds !== null) {
      parameters['event_ids'] = eventIds;
    }

    return this.request(`book_services/${companyId}`, parameters);
  }

  /**
    * Получить список сотрудников доступных для бронирования
    *
    * @param integer  companyId
    * @param integer  staffId - ID сотрудника. Фильтр по идентификатору сотрудника
    * @param   datetime - дата (в формате iso8601). Фильтр по дате
    *                              бронирования услуги (например '2005-09-09T18:30')
    * @param array  serviceIds - ID услуг. Фильтр по списку идентификаторов уже
    *                            выбранных (в рамках одной записи) услуг. Имеет
    *                            смысл если зада фильтр по мастеру и дате.
    * @param array  eventIds - ID акций. Фильтр по списку идентификаторов уже выбранных
    *                          (в рамках одной записи) акций. Имеет смысл если зада
    *                          фильтр по мастеру и дате.
    * @param bool  withoutSeances - Отключает выдачу ближайших свободных сеансов,
    *                               ускоряет получение данных.
    * @return array
    * @access public
    * @see http://docs.yclients.apiary.io/#reference/-/3/0
    * @throws YclientsException
    */

  getBookStaff(
    companyId,
    staffId = null,
    datetime = null, //  
    serviceIds = null, // array 
    eventIds = null, // array 
    withoutSeances = false
  ) {
    let parameters = {};

    if (staffId !== null) {
      parameters['staff_id'] = staffId;
    }

    if (datetime !== null) {
      parameters['datetime'] = new Date(datetime) // datetime -> format(:: ISO8601);
    }

    if (serviceIds !== null) {
      parameters['service_ids'] = serviceIds;
    }

    if (eventIds !== null) {
      parameters['event_ids'] = eventIds;
    }

    if (withoutSeances) {
      parameters['without_seances'] = true;
    }

    return this.request(`book_staff/${companyId}`, parameters);
  }

  /**
   * Получить список дат доступных для бронирования
   *
   * @param integer  companyId
   * @param integer  staffId - ID сотрудника. Фильтр по идентификатору сотрудника
   * @param array  serviceIds - ID услуг. Фильтр по списку идентификаторов уже
   *                            выбранных (в рамках одной записи) услуг. Имеет
   *                            смысл если зада фильтр по мастеру и дате.
   * @param   date - Фильтр по месяцу бронирования (например '2015-09-01')
   * @param array  eventIds - ID акций. Фильтр по списку идентификаторов уже выбранных
   *                          (в рамках одной записи) акций. Имеет смысл если зада
   *                          фильтр по мастеру и дате.
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/-/4/0
   * @throws YclientsException
   */
  getBookDates(
    companyId,
    staffId = null,
    serviceIds = null, // array
    date = null, //  
    eventIds = null // array
  ) {
    let parameters = {};

    if (staffId !== null) {
      parameters['staff_id'] = staffId;
    }

    if (date !== null) {
      //  parameters['date'] =  date->format('Y-m-d');
    }

    if (serviceIds !== null) {
      parameters['service_ids'] = serviceIds;
    }

    if (eventIds !== null) {
      parameters['event_ids'] = eventIds;
    }

    return this.request(`book_dates/${companyId}`, parameters);
  }

  /**
   * Получить список сеансов доступных для бронирования
   *
   * @param integer  companyId
   * @param integer  staffId - ID сотрудника. Фильтр по идентификатору сотрудника
   * @param   date - Фильтр по месяцу бронирования (например '2015-09-01')
   * @param array  serviceIds - ID услуг. Фильтр по списку идентификаторов уже
   *                            выбранных (в рамках одной записи) услуг. Имеет
   *                            смысл если зада фильтр по мастеру и дате.
   * @param array  eventIds - ID акций. Фильтр по списку идентификаторов уже выбранных
   *                          (в рамках одной записи) акций. Имеет смысл если зада
   *                          фильтр по мастеру и дате.
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/-/5/0
   * @throws YclientsException
   */
  getBookTimes(
    companyId,
    staffId,
    date, // 
    serviceIds = null, // array
    eventIds = null // array
  ) {
    let parameters = {};

    if (serviceIds !== null) {
      parameters['service_ids'] = serviceIds;
    }

    if (eventIds !== null) {
      parameters['event_ids'] = eventIds;
    }



    // format(new Date(date), 'yyyy-MM-dd')
    return this.request(`book_times/${companyId}/${staffId}/${format(new Date(date), 'yyyy-MM-dd')}`, parameters);
  }

  /**
   * Отправить СМС код подтверждения номера телефона
   *
   * @param integer  companyId
   * @param string  phone - Телефон, на который будет отправлен код, вида 79991234567
   * @param string  fullname - Имя клиента
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/-/6/0
   * @throws YclientsException
   */
  postBookCode(companyId, phone, fullname = null) {
    parameters = {
      phone
    };

    if (fullname !== null) {
      parameters['fullname'] = fullname;
    }

    return this.request(`book_code/${companyId}`, parameters, METHOD_POST);
  }

  /**
   * Проверить параметры записи
   *
   * @param integer  companyId
   * @param array  appointments - Массив записей со следующими полями:
   *                              integer id - Идентификатор записи
   *                              array services - Массив идентификторов услуг
   *                              array events - Массив идентификторов акций
   *                              integer staff_id - Идентификатор специалиста
   *                              string datetime - Дата и время сеанса в формате ISO8601 (2015-09-29T13:00:00+04:00)
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/-/7/0
   * @throws YclientsException
   */
  postBookCheck(companyId, appointments) {
    // проверим наличие обязательных параметров
    appointments.map(appointment => {
      if (
        typeof appointment['id'] === 'undefined' ||
        typeof appointment['staff_id'] === 'undefined' ||
        typeof appointment['datetime'] === 'undefined'
      ) {
        throw new YclientsException('Запись должна содержать все обязательные поля: id, staff_id, datetime.');
      }
    })

    parameters['appointments'] = appointments;
    
    return this.request(`book_check/${companyId}`, parameters, METHOD_POST);
  }

  /**
   * Создать запись на сеанс
   *
   * @param integer  companyId
   * @param array  person - Массив обязательных данных клиента со следующими полями:
   *                        string phone - Телефон клиента вида 79161502239
   *                        string fullname
   *                        string email
   * @param array  appointments - Массив записей со следующими полями:
   *                              integer id - Идентификатор записи для обратной связи
   *                               services - Массив идентификторов услуг
   *                               events - Массив идентификторов акций
   *                              integer staff_id - Идентификатор специалиста
   *                              string datetime - Дата и время сеанса в формате ISO8601 (2015-09-29T13:00:00+04:00)
   * @param string  code - Код подтверждения номера телефона
   * @param array  notify - Массив используемых нотификацией со следующими ключами:
   *                        string notify_by_sms - За какое кол-во часов напоминанить по смс о записи (0 если не нужно)
   *                        string notify_by_email - За какое кол-во часов напоминанить по email о записи (0 если не нужно)
   * @param string  comment - Комментарий к записи
   * @param string  apiId - Внешний идентификатор записи
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/-/8/0
   * @throws YclientsException
   */
  postBookRecord(
    companyId,
    person,// array
    appointments, //array
    code = null,
    notify = null, // array
    comment = null,
    apiId = null
  ) {
    let parameters = {};

    // проверим наличие обязательных параметров клиента
    // // !isset(person['phone'], person['fullname'], person['email'])) 
    if (
      typeof person['phone'] === 'undefined' ||
      typeof person['fullname'] === 'undefined' ||
      typeof person['email'] === 'undefined'
    ) {
      throw new YclientsException('Клиент должен содержать все обязательные поля: phone, fullname, email.');
    }

    parameters = Object.assign({}, parameters, person);

    if (appointments.length === 0) {
      throw new YclientsException('Должна быть хотя бы одна запись.');
    }

    // проверим наличие обязательных параметров записей

    appointments.map(appointment => {
      if (
        typeof appointment['id'] === 'undefined' ||
        typeof appointment['staff_id'] === 'undefined' ||
        typeof appointment['datetime'] === 'undefined'
        // !isset(appointment['id'], appointment['staff_id'], appointment['datetime'])
      ) {
        throw new YclientsException('Запись должна содержать все обязательные поля: id, staff_id, datetime.');
      }
    })

    parameters['appointments'] = appointments;

    if (notify) {

  
      if (notify['notify_by_sms'] !== 'undefined') { //isset(notify['notify_by_sms']
        parameters['notify_by_sms'] = notify['notify_by_sms'];
      }
      if (notify['notify_by_email'] !== 'undefined') { //isset(notify['notify_by_email']
        parameters['notify_by_email'] = notify['notify_by_email'];
      }
    }

    if (code !== null) {
      parameters['code'] = code;
    }

    if (comment !== null) {
      parameters['comment'] = comment;
    }

    if (apiId !== null) {
      parameters['api_id'] = apiId;
    }

    return this.request(`book_record/${companyId}`, parameters, METHOD_POST);
  }

  /**
   * Авторизоваться по номеру телефона и коду
   *
   * @param string  phone - Телефон, на который будет отправлен код вида 79161005050
   * @param string  code - Код подтверждения номера телефона, высланный по смс
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/1/0/0
   * @throws YclientsException
   */
  postUserAuth(phone, code) {
    parameters = {
      phone,
      code,
    };

    return this.request('user/auth', parameters, METHOD_POST);
  }

  /**
   * Получить записи пользователя
   *
   * @param integer  recordId - ID записи, достаточно для удаления записи если пользователь
   *                            авторизован, получить можно из ответа bookRecord()
   * @param string  recordHash - HASH записи, обязательно для удаления записи если пользователь
   *                             не авторизован, получить можно из ответа bookRecord()
   * @param string  userToken - токен для авторизации пользователя, обязательный, если  recordHash не указан
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/1/1/0
   * @throws YclientsException
   */
  getUserRecords(recordId, recordHash = null, userToken = null) {
    if (!recordHash && !userToken) {
      trigger_error('getUserRecords() expected Argument 2 or Argument 3 required', E_USER_WARNING);
    }

    return this.request(`user/records/${recordId}/${recordHash}`, [], METHOD_GET, true);
  }

  /**
   * Удалить записи пользователя
   *
   * @param integer  recordId - ID записи, достаточно для удаления записи если пользователь
   *                            авторизован, получить можно из ответа bookRecord()
   * @param string  recordHash - HASH записи, обязательно для удаления записи если пользователь
   *                             не авторизован, получить можно из ответа bookRecord()
   * @param string  userToken - Токен для авторизации пользователя, обязательный, если  recordHash не указан
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/1/1/1
   * @throws YclientsException
   */
  deleteUserRecords(recordId, recordHash = null, userToken = null) {
    if (!recordHash && !userToken) {
      trigger_error('deleteUserRecords() expected Argument 2 or Argument 3 required', E_USER_WARNING);
    }

    return this.request(`user/records/${recordId}/${recordHash}`, [], METHOD_DELETE)
    // userToken ?: true);
  }

  /**
   * Получить список компаний
   *
   * @param integer  groupId - ID сети компаний
   * @param bool  active - Если нужно получить только активные для онлайн-записи компании
   * @param bool  moderated - Если нужно получить только прошедшие модерацию компании
   * @param bool  forBooking - Если нужно получить поле next_slot по каждой компании
   * @param bool  my - Если нужно компании, на управление которыми пользователь имеет права ( userToken тогда обязательно)
   * @param string  userToken - Токен для авторизации пользователя, обязательный, если  my указан
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/2/0/0
   * @throws YclientsException
   */
  getCompanies(
    groupId = null,
    active = null,
    moderated = null,
    forBooking = null,
    my = null,
    userToken = null
  ) {
    if (my && !userToken) {
      trigger_error('getCompanies() expected Argument 6 if set Argument 5', E_USER_WARNING);
    }

    let parameters = {};

    if (groupId !== null) {
      parameters['group_id'] = groupId;
    }

    if (active !== null) {
      parameters['active'] = active;
    }

    if (moderated !== null) {
      parameters['moderated'] = moderated;
    }

    if (forBooking !== null) {
      parameters['forBooking'] = forBooking;
    }

    if (my !== null) {
      parameters['my'] = my;
    }

    return this.request('companies', parameters, METHOD_GET) // , userToken ?: true);
  }

  /**
   * Создать компанию
   *
   * @param array  fields - Остальные необязательные поля для создания компании
   * @param string  userToken - Токен для авторизации пользователя
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/2/0/1
   * @throws YclientsException
   */
  postCompany(fields, userToken) {
    if (!isset(fields['title'])) {
      throw new YclientsException('Для создании компании обязательно название компании.');
    }

    return this.request('companies', fields, METHOD_POST, userToken);
  }

  /**
   * Получить компанию
   *
   * @param integer  id
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/2/1/0
   * @throws YclientsException
   */
  getCompany(id) {
    return this.request(`company/${id}`);
  }

  /**
   * Изменить компанию
   *
   * @param integer  id
   * @param array  fields - Остальные необязательные поля для создания компании
   * @param string  userToken - Токен для авторизации пользователя
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/2/1/1
   * @throws YclientsException
   */
  putCompany(id, fields, userToken) {
    return this.request(`company/${id}`, fields, METHOD_PUT, userToken);
  }

  /**
   * Удалить компанию
   *
   * @param integer  id
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/2/1/2
   * @throws YclientsException
   */
  deleteCompany(id) {
    return this.request(`company/${id}`, [], METHOD_DELETE);
  }

  /**
   * Получить список категорий услуг
   *
   * @param integer  companyId - ID компании
   * @param integer  categoryId - ID категории услуг
   * @param integer  staffId - ID сотрудника (для получения категорий, привязанных к сотруднику)
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/3/0/0
   * @throws YclientsException
   */
  getServiceCategories(companyId, categoryId, staffId = null) {
    parameters = [];

    if (staffId !== null) {
      parameters['staff_id'] = staffId;
    }

    return this.request(`service_categories/${companyId}/${categoryId}`, parameters);
  }

  /**
   * Создать категорию услуг
   *
   * @param integer  companyId - ID компании
   * @param integer  categoryId - ID категории услуг
   * @param array  fields - Обязательные поля для категории со следующими полями:
   *                        string title - Название категории
   *                        integer api_id - Внешний идентификатор записи
   *                        integer weight
   *                         staff
   * @param string  userToken - Токен для авторизации пользователя
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/3/0/1
   * @throws YclientsException
   */
  postServiceCategories(companyId, categoryId, fields, userToken) {
    return this.request(`service_categories/${companyId}/${categoryId}`, fields, METHOD_POST,
      userToken);
  }

  /**
   * Получить категорию услуг
   *
   * @param integer  companyId - ID компании
   * @param integer  categoryId - ID категории услуг
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/3/1/0
   * @throws YclientsException
   */
  getServiceCategory(companyId, categoryId) {
    return this.request(`service_category/${companyId}/${categoryId}`);
  }

  /**
   * Изменить категорию услуг
   *
   * @param integer  companyId - ID компании
   * @param integer  categoryId - ID категории услуг
   * @param array  fields - Обязательные поля для категории со следующими полями:
   *                        string title - Название категории
   *                        integer weight
   *                         staff
   * @param string  userToken - Токен для авторизации пользователя
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/3/1/1
   * @throws YclientsException
   */
  putServiceCategory(companyId, categoryId, fields, userToken) {
    return this.request(`service_category/${companyId}/${categoryId}`, fields, METHOD_PUT,
      userToken);
  }

  /**
   * Удалить категорию услуг
   *
   * @param integer  companyId - ID компании
   * @param integer  categoryId - ID категории услуг
   * @param string  userToken - Токен для авторизации пользователя
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/3/1/2
   * @throws YclientsException
   */
  deleteServiceCategory(companyId, categoryId, userToken) {
    return this.request(`service_category/${companyId}/${categoryId}`, [], METHOD_DELETE,
      userToken);
  }

  /**
   * Получить список услуг / конкретную услугу
   *
   * @param integer  companyId - ID компании
   * @param integer  serviceId - ID услуги, если нужно работать с конкретной услугой
   * @param integer  staffId - ID сотрудника, если нужно отфильтровать по сотруднику
   * @param integer  categoryId - ID категории, если нужно отфильтровать по категории
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/4/0//
   * @throws YclientsException
   */
  getServices(companyId, serviceId = null, staffId = null, categoryId = null) {
    parameters = [];

    if (staffId !== null) {
      parameters['staff_id'] = staffId;
    }

    if (categoryId !== null) {
      parameters['category_id'] = categoryId;
    }

    return this.request(`services/${companyId}/${serviceId}`, parameters);
  }

  /**
   * Создать услугу
   *
   * @param integer  companyId - ID компании
   * @param integer  serviceId - ID услуги
   * @param string  title - Название услуги
   * @param integer  categoryId - ID категории услуг
   * @param string  userToken - Токен для авторизации пользователя
   * @param array  fields - Остальные необязательные поля для услуги
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/4/0/0
   * @throws YclientsException
   */
  postServices(companyId, serviceId, categoryId, title, userToken, fields = null) {
    parameters = {
      'category_id': categoryId,
      'title': title,
    };

    parameters = Object.assign(parameters, fields);

    return this.request(`services/${companyId}/${serviceId}`, parameters, METHOD_POST, userToken);
  }

  /**
   * Изменить услугу
   *
   * @param integer  companyId - ID компании
   * @param integer  serviceId - ID услуги
   * @param string  title - Название услуги
   * @param integer  categoryId - ID категории услуг
   * @param string  userToken - Токен для авторизации пользователя
   * @param array  fields - Остальные необязательные поля для услуги
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/4/0/1
   * @throws YclientsException
   */
  putServices(companyId, serviceId, categoryId, title, userToken, fields = null) {
    parameters = {
      'category_id': categoryId,
      'title': title,
    };

    parameters = Object.assign(parameters, fields);

    return this.request(`services/${companyId}/${serviceId}`, parameters, METHOD_PUT, userToken);
  }

  /**
   * Удалить услугу
   *
   * @param integer  companyId - ID компании
   * @param integer  serviceId - ID услуги
   * @param string  userToken - Токен для авторизации пользователя
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/4/0/2
   * @throws YclientsException
   */
  deleteServices(companyId, serviceId, userToken) {
    return this.request(`services/${companyId}/${serviceId}`, [], METHOD_DELETE, userToken);
  }

  /**
   * Получить список акций / конкретную акцию
   *
   * @param integer  companyId - ID компании
   * @param integer  eventId - ID услуги, если нужно работать с конкретной услугой.
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/5//
   * @throws YclientsException
   */
  getEvents(companyId, eventId = null) {
    return this.request(`events/${companyId}/${eventId}`);
  }

  /**
   * Получить список сотрудников / конкретного сотрудника
   *
   * @param integer  companyId - ID компании
   * @param integer  staffId - ID сотрудника, если нужно работать с конкретным сотрудником
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/6//
   * @throws YclientsException
   */
  getStaff(companyId, staffId = null) {
    return this.request(`staff/${companyId}/${staffId}`);
  }

  /**
   * Добавить нового сотрудника
   *
   * @param integer  companyId - ID компании
   * @param integer  staffId - ID сотрудника
   * @param string  name - Имя сотрудника
   * @param string  userToken - Токен для авторизации пользователя
   * @param array  fields - Остальные необязательные поля для сотрудника
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/6/0/0
   * @throws YclientsException
   */
  postStaff(companyId, staffId, name, userToken, fields = null) {
    parameters = {
      name,
    };

    parameters = Object.assign(parameters, fields);

    return this.request(`staff/${companyId}/${staffId}`, parameters, METHOD_POST, userToken);
  }

  /**
   * Изменить сотрудника
   *
   * @param integer  companyId - ID компании
   * @param integer  staffId - ID сотрудника
   * @param array  fields - Остальные необязательные поля для услуги
   * @param string  userToken - Токен для авторизации пользователя
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/6/0/1
   * @throws YclientsException
   */
  putStaff(companyId, staffId, fields, userToken) {
    return this.request(`staff/${companyId}/${staffId}`, fields, METHOD_PUT, userToken);
  }

  /**
   * Удалить сотрудника
   *
   * @param integer  companyId - ID компании
   * @param integer  staffId - ID сотрудника
   * @param string  userToken - Токен для авторизации пользователя
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/6/0/2
   * @throws YclientsException
   */
  deleteStaff(companyId, staffId, userToken) {
    return this.request(`staff/${companyId}/${staffId}`, [], METHOD_DELETE, userToken);
  }

  /**
   * Получить список клиентов
   *
   * @param integer  companyId - ID компании
   * @param string  userToken - Токен для авторизации пользователя
   * @param string  fullname
   * @param string  phone
   * @param string  email
   * @param string  page
   * @param string  count
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/7/0/0
   * @throws YclientsException
   */
  getClients(
    companyId,
    userToken,
    fullname = null,
    phone = null,
    email = null,
    page = null,
    count = null
  ) {
    parameters = [];

    if (fullname !== null) {
      parameters['fullname'] = fullname;
    }

    if (phone !== null) {
      parameters['phone'] = phone;
    }

    if (email !== null) {
      parameters['email'] = email;
    }

    if (page !== null) {
      parameters['page'] = page;
    }

    if (count !== null) {
      parameters['count'] = count;
    }

    return this.request(`clients/${companyId}`, parameters, METHOD_GET, userToken);
  }

  /**
   * Добавить клиента
   *
   * @param integer  companyId - ID компании
   * @param string  name - Имя клиента
   * @param integer  phone - Телефон клиента
   * @param string  userToken - Токен для авторизации пользователя
   * @param array  fields - Остальные необязательные поля для клиента
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/7/0/1
   * @throws YclientsException
   */
  postClients(companyId, name, phone, userToken, fields = null) {
    parameters = [
      name,
      phone,
    ];

    parameters = Object.assign(parameters, fields);

    return this.request(`clients/${companyId}`, parameters, METHOD_POST, userToken);
  }

  /**
   * Получить клиента
   *
   * @param integer  companyId - ID компании
   * @param integer  id - ID клиента
   * @param string  userToken - Токен для авторизации пользователя
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/7/1/0
   * @throws YclientsException
   */
  getClient(companyId, id, userToken) {
    return this.request(`client/${companyId}/${id}`, [], METHOD_GET, userToken);
  }

  /**
   * Редактировать клиента
   *
   * @param integer  companyId - ID компании
   * @param integer  id - ID клиента
   * @param string  userToken - Токен для авторизации пользователя
   * @param array  fields
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/7/1/1
   * @throws YclientsException
   */
  putClient(companyId, id, userToken, fields) {
    return this.request(`client/${companyId}/${id}`, fields, METHOD_PUT, userToken);
  }

  /**
   * Удалить клиента
   *
   * @param integer  companyId - ID компании
   * @param integer  id - ID клиента
   * @param string  userToken - Токен для авторизации пользователя
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/7/1/2
   * @throws YclientsException
   */
  deleteClient(companyId, id, userToken) {
    return this.request(`client/${companyId}/${id}`, [], METHOD_DELETE, userToken);
  }

  /**
   * Получить список записей
   *
   * @param integer  companyId - ID компании
   * @param string  userToken - Токен для авторизации пользователя
   * @param integer  page
   * @param integer  count
   * @param integer  staffId
   * @param integer  clientId
   * @param   startDate
   * @param   endDate
   * @param   cStartDate
   * @param   cEndDate
   * @param   changedAfter
   * @param   changedBefore
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/8/0/0
   * @throws YclientsException
   */
  getRecords(
    companyId,
    userToken,
    page = null,
    count = null,
    staffId = null,
    clientId = null,
    startDate = null,
    endDate = null,
    cStartDate = null,
    cEndDate = null,
    changedAfter = null,
    changedBefore = null
  ) {
    parameters = [];

    if (page !== null) {
      parameters['page'] = page;
    }

    if (count !== null) {
      parameters['count'] = count;
    }

    if (staffId !== null) {
      parameters['staff_id'] = staffId;
    }

    if (clientId !== null) {
      parameters['client_id'] = clientId;
    }

    if (startDate !== null) {
      parameters['start_date'] = format(new Date(startDate), 'yyyy-MM-dd');
    }

    if (endDate !== null) {
      parameters['end_date'] = format(new Date(endDate), 'yyyy-MM-dd');
    }

    if (cStartDate !== null) {
      parameters['c_start_date'] = format(new Date(cStartDate), 'yyyy-MM-dd');
    }

    if (cEndDate !== null) {
      parameters['c_end_date'] = format(new Date(cEndDate), 'yyyy-MM-dd');
    }

    if (changedAfter !== null) {
      parameters['changed_after'] = new Date(changedAfter) // changedAfter -> format(:: ISO8601);
    }

    if (changedBefore !== null) {
      parameters['changed_before'] = new Date(changedBefore)  // -> format(:: ISO8601);
    }

    return this.request(`records/${companyId}`, parameters, METHOD_GET, userToken);
  }

  /**
   * Создать новую запись
   *
   * @param integer  companyId - ID компании
   * @param string  userToken - Токен для авторизации пользователя
   * @param integer  staffId
   * @param array  services
   * @param array  client
   * @param   datetime
   * @param integer  seanceLength
   * @param bool  saveIfBusy
   * @param bool  sendSms
   * @param string  comment
   * @param integer  smsRemainHours
   * @param integer  emailRemainHours
   * @param integer  apiId
   * @param integer  attendance
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/8/0/1
   * @throws YclientsException
   */
  postRecords(
    companyId,
    userToken,
    staffId,
    services,
    client,
    datetime,
    seanceLength,
    saveIfBusy,
    sendSms,
    comment = null,
    smsRemainHours = null,
    emailRemainHours = null,
    apiId = null,
    attendance = null
  ) {
    parameters = [];

    if (staffId !== null) {
      parameters['staff_id'] = staffId;
    }

    if (services !== null) {
      parameters['services'] = services;
    }

    if (client !== null) {
      parameters['client'] = client;
    }

    if (datetime !== null) {
      parameters['datetime'] = new Date(datetime)  // datetime -> format(:: ISO8601);
    }

    if (seanceLength !== null) {
      parameters['seance_length'] = seanceLength;
    }

    if (saveIfBusy !== null) {
      parameters['save_if_busy'] = saveIfBusy;
    }

    if (sendSms !== null) {
      parameters['send_sms'] = sendSms;
    }

    if (comment !== null) {
      parameters['comment'] = comment;
    }

    if (smsRemainHours !== null) {
      parameters['sms_remain_hours'] = smsRemainHours;
    }

    if (emailRemainHours !== null) {
      parameters['email_remain_hours'] = emailRemainHours;
    }

    if (apiId !== null) {
      parameters['api_id'] = apiId;
    }

    if (attendance !== null) {
      parameters['attendance'] = attendance;
    }

    return this.request(`records/${companyId}`, parameters, METHOD_POST, userToken);
  }

  /**
   * Получить запись
   *
   * @param integer  companyId - ID компании
   * @param integer  recordId
   * @param string  userToken - Токен для авторизации пользователя
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/8/1/0
   * @throws YclientsException
   */
  getRecord(companyId, recordId, userToken) {
    return this.request(`record/${companyId}/${recordId}`, [], METHOD_GET, userToken);
  }

  /**
   * Изменить запись
   *
   * @param integer  companyId - ID компании
   * @param integer  recordId
   * @param string  userToken - Токен для авторизации пользователя
   * @param array  fields
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/8/1/1
   * @throws YclientsException
   */
  putRecord(companyId, recordId, userToken, fields) {
    return this.request(`record/${companyId}/${recordId}`, fields, METHOD_PUT, userToken);
  }

  /**
   * Удалить запись
   *
   * @param integer  companyId - ID компании
   * @param integer  recordId
   * @param string  userToken - Токен для авторизации пользователя
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/8/1/2
   * @throws YclientsException
   */
  deleteRecord(companyId, recordId, userToken) {
    return this.request(`record/${companyId}/${recordId}`, [], METHOD_DELETE, userToken);
  }

  /**
   * Изменить расписание работы сотрудника
   *
   * @param integer  companyId - ID компании
   * @param integer  staffId
   * @param string  userToken - Токен для авторизации пользователя
   * @param array  fields
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/9/0
   * @throws YclientsException
   */
  putSchedule(companyId, staffId, userToken, fields) {
    return this.request(`schedule/${companyId}/${staffId}`, fields, METHOD_PUT, userToken);
  }

  /**
   * Получить список дат для журнала
   *
   * @param integer  companyId - ID компании
   * @param   date
   * @param integer  staffId
   * @param string  userToken - Токен для авторизации пользователя
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/10/0/0
   * @throws YclientsException
   */
  getTimetableDates(companyId, date, staffId, userToken) {
    parameters = [];

    if (staffId !== null) {
      parameters['staff_id'] = staffId;
    }

    return this.request(`timetable/dates/${companyId}/${format(new Date(date), 'yyyy-MM-dd')}`, parameters,
      METHOD_GET, userToken);
  }

  /**
   * Получить список сеансов для журнала
   *
   * @param integer  companyId - ID компании
   * @param   date
   * @param integer  staffId
   * @param string  userToken - Токен для авторизации пользователя
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/11/0/0
   * @throws YclientsException
   */
  getTimetableSeances(companyId, date, staffId, userToken) {
    return this.request(`timetable/seances/${companyId}/${staffId}/${format(new Date(date), 'yyyy-MM-dd')}`, [],
      METHOD_GET, userToken);
  }

  /**
   * Получить комментарии
   *
   * @param integer  companyId - ID компании
   * @param string  userToken - Токен для авторизации пользователя
   * @param   startDate
   * @param   endDate
   * @param integer  staffId
   * @param integer  rating
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/12/0/0
   * @throws YclientsException
   */
  getComments(
    companyId,
    userToken,
    startDate = null, //  
    endDate = null, //  
    staffId = null,
    rating = null
  ) {
    parameters = [];

    if (startDate !== null) {
      parameters['start_date'] = format(new Date(startDate), 'yyyy-MM-dd');
    }

    if (endDate !== null) {
      parameters['end_date'] = format(new Date(endDate), 'yyyy-MM-dd');
    }

    if (staffId !== null) {
      parameters['staff_id'] = staffId;
    }

    if (rating !== null) {
      parameters['rating'] = rating;
    }

    return this.request(`comments/${companyId}`, parameters, METHOD_GET, userToken);
  }

  /**
   * Получить пользователей компании
   *
   * @param integer  companyId - ID компании
   * @param string  userToken - Токен для авторизации пользователя
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/13/0/0
   * @throws YclientsException
   */
  getCompanyUsers(companyId, userToken) {
    return this.request(`company_users/${companyId}`, [], METHOD_GET, userToken);
  }

  /**
   * Получить кассы компании
   *
   * @param integer  companyId - ID компании
   * @param string  userToken - Токен для авторизации пользователя
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/14/0/0
   * @throws YclientsException
   */
  getAccounts(companyId, userToken) {
    return this.request(`accounts/${companyId}`, [], METHOD_GET, userToken);
  }

  /**
   * Отправить SMS
   *
   * @param integer  companyId - ID компании
   * @param string  userToken - Токен для авторизации пользователя
   * @param integer[]  clientIds - ID клиентов
   * @param string  text - Тест сообщения
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/14/0/0
   * @throws YclientsException
   */
  sendSMS(companyId, userToken, clientIds, text) {
    parameters = [];
    parameters['client_ids'] = clientIds;
    parameters['text'] = text;

    return this.request(`sms/clients/by_id/${companyId}`, parameters, METHOD_POST, userToken);
  }

  /**
   * Получить склады компании
   *
   * @param integer  companyId - ID компании
   * @param string  userToken - Токен для авторизации пользователя
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/15/0/0
   * @throws YclientsException
   */
  getStorages(companyId, userToken) {
    return this.request(`storages/${companyId}`, [], METHOD_GET, userToken);
  }

  /**
   * Получить настройки уведомлений о событиях
   *
   * @param integer  companyId - ID компании
   * @param string  userToken - Токен для авторизации пользователя
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/18/0/0
   * @throws YclientsException
   */
  getHooks(companyId, userToken) {
    return this.request(`hooks_settings/${companyId}`, [], METHOD_GET, userToken);
  }

  /**
   * Изменить настройки уведомлений о событиях
   *
   * @param integer  companyId - ID компании
   * @param array  fields
   * @param string  userToken - Токен для авторизации пользователя
   * @return array
   * @access public
   * @see http://docs.yclients.apiary.io/#reference/18/0/1
   * @throws YclientsException
   */
  postHooks(companyId, fields, userToken) {
    if (!isset(fields['url'])) {
      throw new YclientsException('Не передан обязательный параметр url');
    }
    if (!isset(fields['active'])) {
      throw new YclientsException('Не передан обязательный параметр active');
    }
    return this.request(`hooks_settings/${companyId}`, fields, METHOD_POST, userToken);
  }
}

exports.YclientsApi = YclientsApi