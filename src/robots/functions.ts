import axios from 'axios'

const axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer EAAGn4zQJcqMBOwkCYsis64SM3RsbyQBaaezLYyJeVZAZCRkEk6TjeZAHZAZA4toosnBFSgSflJb5yvF84BN3vZCAkCqfZBsQ8ulMqUPwCH6EdOXVultmzVucAvHTvzZA3pLyTICWp96AxhWoKZC7eZBiG4aZC4aSo3Hb5tFuQ5in5HIYZCuSt1JZBqxZBSXLtMKK8Gb5ZB7E9jMXMJTZAlhnD0HNOBfknv12NS83`
    }
}
const WAID = "330107063520094"
function toTitleCase(str:string) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
}

const sendOptionsInsurance = async (number:string, wmaid:string) => {
    axios.post(`https://graph.facebook.com/v14.0/${WAID}/messages`, {
        messaging_product: 'whatsapp',
        context: {
            message_id: wmaid
        },
        to: number,
        type: "interactive",
        interactive: {
            type: "button",
            header: {
                type: "text",
                text: "Seguradoras"
            },
            body: {
                text: "Escolha a seguradora desejada:"

            },
            action: {
                buttons: [
                    {
                        type: "reply",
                        reply: {
                            id: "alirio",
                            title: "Alirio" 
                        }
                    },
                    {
                        type: "reply",
                        reply: {
                            id: "Allianz",
                            title: "Allianz" 
                        }
                    },
                    {
                        type: "reply",
                        reply: {
                            id: "Azul",
                            title: "Azul" 
                        }
                    }
                ]
            }  
        }
    }, axiosConfig)

    .then(function (response) {
        return true
    })
    .catch(function (error) {
        console.log(error);
    });
}
const sendOptionsIntermedInsurance = async (number:string, wmaid:string) => {
    axios.post(`https://graph.facebook.com/v14.0/${WAID}/messages`, {
        messaging_product: 'whatsapp',
        context: {
            message_id: wmaid
        },
        to: number,
        type: "interactive",
        interactive: {
            type: "button",
            header: {
                type: "text",
                text: "Voce sabe qual a sua seguradora?"
            },
            body: {
                text: "Digite seu CPF/CNPJ nesses formatos 000.000.000-00 / 00.000.319/0001-80"

            },
            action: {
                buttons: [
                    {
                        type: "reply",
                        reply: {
                            id: "inicio",
                            title: "Voltar inicio" 
                        }
                    }
                ]
            }  
        }
    }, axiosConfig)

    .then(function (response) {
        return true
    })
    .catch(function (error) {
        console.log(error);
    });
}
const sendInitialOptions = async (number:string, wmaid:string) => {
    axios.post(`https://graph.facebook.com/v14.0/${WAID}/messages`, {
        messaging_product: 'whatsapp',
        context: {
            message_id: wmaid
        },
        to: number,
        type: "interactive",
        interactive: {
            type: "button",
            header: {
                type: "text",
                text: "ChatBot"
            },
            body: {
                text: `Olá, Tudo bem? \n
                No momento eu não garanto que responderei imediatamente, por isso criei essas opções para facilitar seu atendimento.\n`

            },
            action: {
                buttons: [
                    {
                        type: "reply",
                        reply: {
                            id: "seguradora",
                            title: "Assistencia 24 horas" 
                        }
                    },
                    {
                        type: "reply",
                        reply: {
                            id: "orçamento",
                            title: "Solicitar orçamento" 
                        }
                    },
                    {
                        type: "reply",
                        reply: {
                            id: "recado",
                            title: "Deixar recado" 
                        }
                    }
                ]
            }  
        }
    }, axiosConfig)

    .then(function (response) {
        return true
    })
    .catch(function (error) {
        console.log(error);
    });
}



type userType = {    
    "CPF": string,
    "CNPJ": string,
    "Placa": string,
    "Seguradora": string,
    "Modalidade ": string,
    "TelefoneCapitais": string,
    "TelefoneOutrasLocalidades": string,
    "WhatsApp": string
}   


const searchUser = async(message:string) => {
    const res = await fetch("../database.json");
    const data = await res.json();
    let cpf:userType = data.find((item: userType) => item["CPF"] === message);
    let cnpj = data.find((item: userType) => item["CNPJ"] === message);
    
    return [cpf,cnpj]
}





const sendMessage = async (number:string, message:string, wmaid?:string) => {
    if (wmaid) {
        axios.post(`https://graph.facebook.com/v14.0/${WAID}/messages`, {
            messaging_product: 'whatsapp',
            context: {
                message_id: wmaid
            },
            to: number,
            type: "text",
            text: { 
                "body": message, 
            }
        }, axiosConfig)

        .then(function (response) {
            return true
        })
        .catch(function (error) {
            console.log(error);
        });
    } else {
        axios.post(`https://graph.facebook.com/v14.0/${process.env.WAID}/messages`, {
            messaging_product: 'whatsapp',
            to: number,
            type: "text",
            text: { 
                "body": message, 
            }
        }, axiosConfig)

        .then(function (response) {
            return true
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

const sendTranslatedMessage = async (number:string, message:string, wmaid:string, lang:"en"|"pt") => {
    const isEn = lang == "en"
    const translatedMessage = await axios.get("https://api.mymemory.translated.net/get", {
        params: {
            q: message,
            langpair: isEn ? "en-us|pt-pt" : "pt-pt|en-us"
        }
    })

    sendMessage(number, translatedMessage.data.responseData.translatedText, wmaid)
}

const sendNew = async (link:string, destination:string, wmaid:string) => {
    try {
        const post = await getNew(link)
        let caption = `*${post.title}*\n\n\n`

        post.content.map((item:any) => {
            caption += `${item}\n\n`
        })

        caption += `\n${post.link}`

        sendImage(destination, post.image, caption, wmaid)
    } catch (err) {
        console.log(err)
    }
}

const sendNewsList = async (number:string, wmaid:string, posts:any) => {
    const sections = posts.map((item:any) => {
        const DESCRIPTION_LIMIT = 68
        const aboveTitleDescription = DESCRIPTION_LIMIT < item.title.length 
        const dotsOrEmpyDescription = aboveTitleDescription ? "..." : ""

        return {
            title: posts.indexOf(item) + 1,
            rows: [
                {
                    id: item.link,
                    title: "Ler mais",
                    description: item.title.substring(0, DESCRIPTION_LIMIT) + dotsOrEmpyDescription
                }
            ]
        }
    })

    axios.post(`https://graph.facebook.com/v14.0/${process.env.WAID}/messages`, {
        messaging_product: 'whatsapp',
        context: {
            message_id: wmaid
        },
        to: number,
        type: "interactive",
        interactive: {
            type: "list",
            header: {
                type: "text",
                text: "Noticias"
            },
            body: {
                text: "Selecione uma noticia."
            },
            action: {
                button: "Ver noticias",
                sections,
            }
        }
    }, axiosConfig)

    .then(function (response) {
        return true
    })
    .catch(function (error) {
        console.log(error);
    });
}

const getNew = async (link:string) => {
    const id = link.replace("https://kabum.digital/", "")
    const data = await axios.get(`https://kabum-digital.herokuapp.com/post/${id}`)
    .then(async res => {
        const post = res.data.post
        return post
    }).catch(err => {
        throw new Error("Erro")
    })
    return data
}

const sendAudio = async (number:string, link:string, wmaid:string) => {
    axios.post(`https://graph.facebook.com/v14.0/${process.env.WAID}/messages`, {
        messaging_product: 'whatsapp',
        context: {
            message_id: wmaid
        },
        to: number,
        type: "audio",
        audio: { 
            link: link, 
        }
    }, axiosConfig)

    .then(function (response) {
        return true
    })
    .catch(function (error) {
        console.log(error);
    });
}

const sendImage = async (number:string, link:string, caption:string, wmaid:string) => {
    axios.post(`https://graph.facebook.com/v14.0/${process.env.WAID}/messages`, {
        messaging_product: 'whatsapp',
        context: {
            message_id: wmaid
        },
        to: number,
        type: "image",
        image: { 
            link: link,
            caption: caption 
        }
    }, axiosConfig)

    .then(function (response) {
        return true
    })
    .catch(function (error) {
        console.log(error);
    });
}

const sendDevContact = async (number:string, wmaid:string) => {
    axios.post(`https://graph.facebook.com/v14.0/${process.env.WAID}/messages`, {
        messaging_product: 'whatsapp',
        context: {
            message_id: wmaid
        },
        to: number,
        type: "contacts",
        contacts: [
            {
                "birthday": "2006-04-14",
                "emails": [
                    {
                        "email": "jeffersunde72@gmail.com",
                        "type": "WORK"
                    }
                ],
                "name": {
                    "first_name": "Jeffer",
                    "formatted_name": "Jeffer Marcelino",
                    "last_name": "Sunde"
                },
                "org": {
                    "company": "CEG Microsystems",
                    "department": "Tech",
                    "title": "Developer"
                },
                "phones": [
                    {
                        "phone": "+258 84 399 7730",
                        "type": "WORK",
                        "wa_id": "258843997730"
                    },
                    {
                        "phone": "+258 87 012 6103",
                        "type": "HOME"
                    }
                ],
                "urls": [
                    {
                        "url": "https://github.com/JefferMarcelino",
                        "type": "WORK"
                    }
                ]
            }
        ]
    }, axiosConfig)

    .then(function (response) {
        return true
    })
    .catch(function (error) {
        console.log(error);
    });
}

const removeCommand = (command:string, text:string) => {
    const slipted = text.split(" ")
    let params = ""
    slipted.forEach(item => {
        if (item.toLowerCase() !== command) {
            params += ` ${ item }`
        }
    })
    return params.trim()
}

const getNewsByCategory = async (category: "random" | "mostread") => {
    if (category == "mostread") {
        const data = axios.get("https://kabum-digital.herokuapp.com/mostread")
        .then(async res => {
            const posts = res.data.posts
            return posts
        }).catch(err => {
            throw new Error("Erro")
        })
        return data
    } else if (category == "random") {
        const data = axios.get("https://kabum-digital.herokuapp.com/random")
        .then(async res => {
            const posts = res.data.posts
            return posts
        }).catch(err => {
            throw new Error("Erro")
        })
        return data
    }
}

const generateRandomInteger =(max:number) => {
    return Math.floor(Math.random() * max) + 1;
}

export {   searchUser,sendNewsList, sendMessage, sendImage, sendAudio, sendDevContact, removeCommand, toTitleCase, sendInitialOptions, getNewsByCategory, generateRandomInteger, sendTranslatedMessage, sendNew,sendOptionsInsurance, sendOptionsIntermedInsurance }
