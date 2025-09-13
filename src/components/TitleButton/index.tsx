import Button from "../Button"
const TitleButton = ({variant= "primary", onClick=()=>{}, Btnname=""}) => {
    const oColorPicker= {
        primary: ['var(--logout-button)',"white"]
    }
return (
    <Button sx={{backgroundColor: oColorPicker[variant][0], color:oColorPicker[variant][1],borderRadius:"15px", padding:"10px" ,height: "3rem"}} onClick={onClick}>{Btnname}</Button>
)
}
export default TitleButton;