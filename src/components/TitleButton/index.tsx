import Button from "../Button"
const TitleButton = ({variant= "primary"}) => {
    const oColorPicker= {
        primary: ['#00BC90',"white"]
    }
return (
    <Button sx={{backgroundColor: oColorPicker[variant][0], color:oColorPicker[variant][1],borderRadius:"15px", padding:"10px"}} onClick={()=>navigate('/semester/create')}>Add</Button>
)
}
export default TitleButton;