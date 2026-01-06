import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { View,Text,TextInput,Button } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';


const SignupScreen=()=>{
    const navigation = useNavigation();

    const[nemail, nsetemail] = useState('');
    const[npassword, nsetpassword]= useState('');


    const validation= async()=>{

        if(nemail === '' && npassword === ''){
            alert('Please fill all fields');
            return;
        }
        else{
            try{
                const userData = {
                        email: nemail,
                        password: npassword
                    };  
                const users = await AsyncStorage.getItem('users');
                const existingUsers = users ? JSON.parse(users) : [];
                const newUsers = [...existingUsers, userData];
                await AsyncStorage.setItem('users', JSON.stringify(newUsers));
                alert('Signup successful! Please login.');
                navigation.navigate('Login');
            }catch(error){
                console.log(error);
            }
        }
    }

    return(
        <View >
            <Text style={{fontSize:45, fontWeight:'bold', textAlign:'center', marginTop:70}}>Signup</Text>
            <View style={{marginTop:70,alignContent:'center',padding:20}}>

                <Text>Email:</Text>
                <TextInput 
                placeholder="Enter email" 
                style={{borderWidth:1, borderColor:'black', marginBottom:20}}
                onChangeText={(text)=>{nsetemail(text)}}
                value={nemail}
                 /> 
                
          
                <Text>Password:</Text>
                <TextInput 
                placeholder="Enter password" 
                secureTextEntry={true}
                style={{borderWidth:1, borderColor:'black', marginBottom:20}}
                onChangeText={(text)=>{nsetpassword(text)}}
                value={npassword}
                 />


                  <Button title="Signup" onPress={() => {validation()}} />
            </View>
          
        </View>
    )
}

export default SignupScreen;