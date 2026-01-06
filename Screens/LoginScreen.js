import React, { useState } from "react";  
import { View, Text, TextInput, Button,TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";

// import { Button } from "react-native/types_generated/index";
// import { TextInput } from "react-native/types_generated/index";

const LoginScreen=()=>{

    const navigation = useNavigation();

    const[email, setemail] = useState('');
    const[password, setpassword]= useState('');



    const validation= async()=>{

        if(email === '' && password === ''){

            alert('Please fill all fields');
            return;
            
        }
        else{
            try{



                const users = await AsyncStorage.getItem('users');
                console.log(users);
                if (!users) {
                    alert('No user found, please signup first');
                    return;
                    
                } else {
                    const existingUsers = JSON.parse(users);
                    const validUser = existingUsers.find(
                        (u) => u.email === email && u.password === password
                    );

                    if (validUser) {
                        alert('Login Successful');
                        navigation.navigate('Home');
                    } else {
                        alert('Invalid email or password');
                    }
                }

                
                    
                



                // await AsyncStorage.setItem(
                // 'user',
                // JSON.stringify({
                //     id: 1,
                //     name: 'Hamza',
                //     token: 'abc123',
                // })
                // );



                // await AsyncStorage.getItem('email');
                // await AsyncStorage.getItem('password');
                // console.log();
                
                alert('Login Successful');
            }catch(e){
                console.log(e);
            }
            
        }
    }

   

    return(

        <View>
            <Text style={{fontSize:45, fontWeight:'bold', textAlign:'center', marginTop:70}}>Login</Text>
            <View style={{padding:20, marginTop:50, gap:20, alignContent:'center'}}>
                <TextInput 
                style={{ borderColor: 'black', borderWidth: 1}}
                placeholder='Enter email'
                value={email}
                onChangeText={(text)=>{setemail(text)}}
                />

                <TextInput 
                style={{ borderColor: 'black', borderWidth: 1}}
                placeholder='Enter password'
                value={password}
                onChangeText={(text)=>{setpassword(text)}}
                secureTextEntry={true}
                
                />

                <TouchableOpacity onPress={validation} >
                    <View>
                    <Text style={{textAlign:'center', marginTop:20, fontSize:16, color:'white', backgroundColor:'blue', height:40, padding:8, borderRadius:8}}>Signin</Text>
                </View>
                </TouchableOpacity>                {/* <Button title="Signup" onPress={()=>{ }} ></Button> */}
                <TouchableOpacity onPress={()=>{ navigation.navigate('Signup')}} >
                    <View>
                    <Text style={{textAlign:'center', marginTop:5, fontSize:16, color:'white', backgroundColor:'blue', height:40, padding:8, borderRadius:8}}>Signup</Text>
                </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default LoginScreen;
