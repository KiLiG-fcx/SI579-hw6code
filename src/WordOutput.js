export function WordOutput(props){
    return (<li>{props.word} 
    <button type='button' 
    className='btn btn-outline-success'
    onClick={props.onSave}>(Save)
    </button></li>)
}