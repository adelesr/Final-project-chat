
const OptionPanel = ({ clickHandler }) => {
    return (
      <div className='options-panel'>
            <button id='rock' onClick={clickHandler} className="cs-hand" data-hand="0" data-image="🤛">
            </button>
            <button id='paper' onClick={clickHandler} className="cs-hand" data-hand="1" data-image="✋">
            </button>
            <button id='scissors' onClick={clickHandler} className="cs-hand" data-hand="2" data-image="✌">
            </button>
      </div>
    );
};

export default OptionPanel;