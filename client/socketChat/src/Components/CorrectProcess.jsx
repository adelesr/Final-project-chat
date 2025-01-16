import React from 'react'

const CorrectProcess = ({param,equalTo,succsesMsg,errMsg}) => {

  return (
    <>
        <div>
            {param==equalTo ? 
            (<div style={{color:'green', margin:2}}>
                    <ion-icon name="checkmark-circle"></ion-icon>
                    {succsesMsg}
             </div>) :
            (<p style={{color:'red'}}>{errMsg}</p>)
            }
        </div>
    </>
  )
}

export default CorrectProcess