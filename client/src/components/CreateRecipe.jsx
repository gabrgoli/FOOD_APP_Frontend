import React, { useState, useEffect } from "react";
import { Link ,  useNavigate } from "react-router-dom"
import { postRecipe } from "../actions"
import { useDispatch , useSelector } from "react-redux"
//import styles from "../Styles/CreateRecipe.module.css"
import '../styles/Buttons.css';
import NavBar from './NavBar'
import { Grid,CardMedia, Box, Typography, Divider } from '@mui/material'
import { TextField,Select,Container, UploadOulined,InputLabel, OutlinedInput, InputAdornment, MenuItem, Button, FormLabel, FormControlLabel } from '@mui/material';
import { useRef } from 'react';
import { UploadOutlined } from '@ant-design/icons';
//import { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
//import { Swiper, SwiperSlide } from 'swiper/react'
//import 'swiper/css';
//import swal from 'sweetalert';

function validate(post){
    let errors = {}
    if (!post.title){ //si no hay nada
        errors.title = "Tu receta necesita un titulo"
    } else if (!post.summary){ //si no hay nada
        errors.summary = "Brinda una pequeña descripcion de tu receta"
    } else if (!post.instructions){ //si no hay nada
        errors.instructions = "No te olvides de contar como la preparaste"
    }
    return errors
}

    
export default function RecipeCreate(){

    const fileInputRef=useRef(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const allDiets = useSelector((state) => state.diets)
    const [errors, setErrors] = useState({}) //estado local para manejar errores
    const[images,setImages]=React.useState([]);//array de strings de url de imagenes 
    const[upLoading,setUpLoading]=React.useState(false) //estado que sirve para mostrar "cargando foto"
  
    const [post, setPost] = useState({
        title: "",
        resumen: "",
        puntuacion: 50,
        nivel: 50,
        pasoApaso: "",
        imagen:"",
        dieta: []  
    })

    const handleUploadPicture=  (e)=>{
      const pics = e.target.files;
      if (pics[0]===undefined)  return  0
  
      setUpLoading(true); //marcador de loading...
     
      for(const pic of pics){
        let formData=new FormData();
        formData.append('file',pic);
        formData.append('upload_preset','images');
         fetch('https://api.cloudinary.com/v1_1/dnlooxokf/upload',{
          method: 'POST',
          body: formData,
        })
          .then((res)=>res.json())
          .then((res)=> {
            setImages(images=>[...images,res.url]);
            setUpLoading(false);
          })
          .catch(error=>console.log(error));
        }
    };


    function handleChange(e){
        setPost({ //a mendida que escribo setea y va guardando
            ...post,
            [e.target.name]: e.target.value //va llenando el estado post a medida que va modificando
        })
        setErrors(validate({
            ...post,
            [e.target.name]: e.target.value
        }))
    }

    function handleSelect(e){
        setPost({
            ...post,
            dieta: [...post.dieta, e.target.value] //guarda en un arreglo lo qe vaya seleccionando
        })

    }

    const handlePictureDelete=(e,image)=>{
        e.preventDefault()
        setImages(images.filter(element=>//deja afuera el elemento que tenga la url a eliminar
        element!==image
      ))
      }

    function handleDietDelete(deleteThis){
        setPost({
            ...post,
            diets: post.diets.filter(diet => diet !== deleteThis)
        })
    }

    function handleSubmit(e){
        console.log("el post",post)
        if(!post.title || !post.resumen){
            e.preventDefault()
            return alert("La receta necesita un titulo y un resumen")
        } else if(!post.dieta.length){
            e.preventDefault()
            return alert("Necesitas agregar por lo menos 1 tipo de dieta a la receta")
        } 

            const newPost={...post,imagen:images[0]?images[0]:"https://res.cloudinary.com/dnlooxokf/image/upload/v1654057815/images/pzhs1ykafhvxlhabq2gt.jpg"}

            dispatch(postRecipe(newPost))
            alert("Se creo la receta exitosamente!")
            navigate("/home")
        
    }


    return(
        <div >

            <NavBar />
            <Box marginTop='250px'/>
            <h1 >CREA TU PROPIA RECETA</h1>
            <form >
                <div >
                    <TextField id="formtitle" label="Titulo" variant="outlined" name='title' value={post.title} onChange={(e)=>handleChange(e)} ></TextField>
                    {errors.title && (<p >{errors.title}</p>)}
                </div>
                <div >
                    <TextField multiline rows={5} id="formSummary" label="Resumen" variant="outlined" name='resumen' value={post.resumen} onChange={(e)=>handleChange(e)} ></TextField>
                    {errors.resumen && (<p >{errors.resumen}</p>)}
                </div>
                <div >
                    <label >Puntuacion</label>
                    <input  type="range" min="0" max="100" value={post.puntuacion} name="puntuacion" onChange={(e) => handleChange(e)}></input>
                    {<p >{post.puntuacion}</p>}
                </div>
                <div >
                    <label >Nivel</label>
                    <input  type="range" min="0" max="100" value={post.nivel} name="nivel" onChange={(e) => handleChange(e)}></input>
                    {<p >{post.nivel}</p>}
                </div>
                <div >
                    <label >Paso a paso</label>
                    <textarea  type="text" value={post.pasoApaso} name="pasoApaso" onChange={(e) => handleChange(e)}></textarea>
                    {errors.pasoApaso && (<p >{errors.pasoApaso}</p>)}
                </div>
                {/* <div >
                    <label >Cargar url de la imagen</label>
                    <input  type="url" value={post.image} name="image" onChange={(e) => handleChange(e)}></input>
                </div> */}


                <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center'}}>
                    <Button
                    color="secondary"
                    fullWidth
                    startIcon={ <UploadOutlined /> }
                    onClick={ () => fileInputRef.current?.click() }
                    >
                        Cargar imagen
                    </Button>
                </Box>


                        <input 
                        multiple
                        aria-label="Archivo" 
                        type="file" name="imagen" 
                        onChange={handleUploadPicture} 
                        ref={ fileInputRef }
                        style={{ display: 'none' }}
                        />




              <Container display='flex' flexDirection='row' justifyContent='center' width={10}  >
                {images[0]?
                images.map(image=>(
                  <Container>
                      {/* <Link target="_blank" href={image}> */}
                      <CardMedia
                        
                        component="img"
                        height="250"
                        image={image}
                        alt="gf"
                        sx={{objectFit:'contain',  zIndex: 'modal' }}
                      />
                      {/* </Link> */}
                    
                      <Box display='flex' justifyContent='center' sx={{ zIndex: 'tooltip' }} onClick={(e)=>{handlePictureDelete(e,image)}}>
                        <Button  color = 'error' >Borrar</Button>
                      </Box>
                   </Container>
                )):<></>}
              </Container>
              {upLoading && <p>Subiendo Foto...</p> }

            <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center'}}>
              <Typography display='flex' justifyContent='center'>subiste {images.length} fotos</Typography>
            </Box>   


                <div >
                    <select onChange={(e)=> handleSelect(e)}>
                        <option value="all" hidden name="diets" >Selecciona tipo de dieta</option>
                            {allDiets?.map(diet => {
                            return ( <option value={diet.id} key={diet.id}>{diet.name}</option>)
                            })
                            } 
                    </select>
                    <ul>
                        <li>                            
                            {post.dieta.map(diet => 
                            <div >
                                <p>{diet}</p>
                                <button onClick={() => handleDietDelete(diet)}>x </button>
                            </div>
                            )}
                        </li>
                    </ul>
                </div>
                <button  type="submit" onClick={(e) => handleSubmit(e)}>Crear Receta</button>
            </form>
        </div>
    )


}

//  <p>{allDiets?.find(element => element.id === diet)?.name}</p>