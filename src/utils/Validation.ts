import {Iorder} from 'src/utils/interface';

export const OrderValidator =(data :Omit<Iorder , "orderLineItems">)=>{
        const missingParams= []
        const mandatoryParam = ['customer_id','status']
        const keys = Object.keys(data)
        mandatoryParam.forEach((val)=>{
          if(!keys.includes(val)){
            missingParams.push(val)
          }
        })

        if(missingParams.length){
            throw new Error(`Mandatory params missing in Order ${missingParams.join(',')}`)
        }
} 

export const orderLineItemsValidator = (data: Pick<Iorder ,"orderLineItems" > )=>{
        const mandatoryParam = ["product_id" , "quantity"]
        // const missingParams = []
       
        data.orderLineItems.forEach((values)=>{
            Object.keys(values).filter((val)=>
                    {             
                        if(!mandatoryParam.includes(val)){
                            throw new Error(`Mandatory params missing in OrderLineItems ${val} `)
                        }
                    })
            })
}

const Validation = {
    OrderValidator,
    orderLineItemsValidator
}

export {Validation}