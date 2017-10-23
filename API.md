# API Documentation

<a name="Handler"></a>

## Handler
Query handler for SauceNAO.

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | API key |
| numRes | <code>Number</code> | Amount of responses returned from the API. |
| shortLimiter | <code>Ratelimiter</code> | Ratelimiter object that takes care of the short period, usually 30 seconds. |
| longLimiter | <code>Ratelimiter</code> | Ratelimiter object that takes care of the long period, usually 24 hours. |
| dbMask | ``Number`` | dbMask Mask for selecting specific indexes to ENABLE. dbmask=8191 will search all of the first 14 indexes. If intending to search all databases, the db=999 option is more appropriate.| 
| dbMaskI | ``Number`` | dbMaskI Mask for selecting specific indexes to DISABLE. dbmaski=8191 would search only indexes higher than the first 14. This is ideal when attempting to disable only certain indexes, while allowing future indexes to be included by default.|
| testMode | ``Number`` | Causes each index which has a match to output at most 1 for testing. Works best with a numres greater than the number of indexes searched. |



* [Handler](#Handler)
    * [new Handler(key, [options])](#new_Handler_new)
    * [.getSauce(file)](#Handler+getSauce) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
    * [.getSource(file)](#Handler+getSource) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>

<a name="new_Handler_new"></a>

### new Handler(key, [options])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| key | <code>String</code> |  | API Key for SauceNAO |
| [options] | <code>Object</code> |  | Optional options |
| [options.numRes] | <code>Number</code> | <code>5</code> | Number of results to get from SauceNAO. |
| [options.getRating] | <code>Boolean</code> | <code>false</code> | Whether to retrieve the rating of a source or not. |

<a name="Handler+getSauce"></a>

### handler.getSauce(file) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
Searches for potential sources of an image.

**Kind**: instance method of [<code>Handler</code>](#Handler)  
**Returns**: <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code> - An array of all the results from the API, with parsed data.  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>String</code> | Either a file or URL that you want to find the source of. |

**Example**  
```js
client.getSauce('http://cfile29.uf.tistory.com/image/277D9B3453F9D9283659F4').then(console.log);
```
<a name="Handler+getSource"></a>

### handler.getSource(file) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
An alias of Sagiri#getSauce

**Kind**: instance method of [<code>Handler</code>](#Handler)  
**Returns**: <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code> - An array of all the results from the API, with parsed data.  
**See**: Sagiri#getSauce  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>String</code> | Either a file or URL that you want to find the source of. |

