/**
 * Pydio Cells Rest API
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 */


import ApiClient from '../ApiClient';
import ActivitySubscription from './ActivitySubscription';





/**
* The RestSubscriptionsCollection model module.
* @module model/RestSubscriptionsCollection
* @version 1.0
*/
export default class RestSubscriptionsCollection {
    /**
    * Constructs a new <code>RestSubscriptionsCollection</code>.
    * @alias module:model/RestSubscriptionsCollection
    * @class
    */

    constructor() {
        

        
        

        

        
    }

    /**
    * Constructs a <code>RestSubscriptionsCollection</code> from a plain JavaScript object, optionally creating a new instance.
    * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
    * @param {Object} data The plain JavaScript object bearing properties of interest.
    * @param {module:model/RestSubscriptionsCollection} obj Optional instance to populate.
    * @return {module:model/RestSubscriptionsCollection} The populated <code>RestSubscriptionsCollection</code> instance.
    */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new RestSubscriptionsCollection();

            
            
            

            if (data.hasOwnProperty('subscriptions')) {
                obj['subscriptions'] = ApiClient.convertToType(data['subscriptions'], [ActivitySubscription]);
            }
        }
        return obj;
    }

    /**
    * @member {Array.<module:model/ActivitySubscription>} subscriptions
    */
    subscriptions = undefined;








}


