const moment = require('moment');
const { request, response } = require('express');

const isDate = (value, { req, location, path  }) => {

    if( !value ) {
        return false;
    }

    const fecha = moment( value );
    if( fecha.isValid() ) {
        return true;
    } else {
        return false;
    }

}

module.exports = {
    isDate
};