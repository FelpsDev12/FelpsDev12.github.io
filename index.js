const input = document.getElementById('message_input')
const pickerDiv = document.getElementById('emoji-picker');
const toggle = document.getElementById('add_reaction');
const emoji_reaction = document.getElementById('reaction')
const send_message = document.getElementById('send_message')
const message_of_the_day = document.getElementById('message_of_the_day')
const daily_message_reaction = document.getElementById('daily_message_reaction')
const daily_message_box = document.querySelector('.daily_message_box')
const btn_add_humor = document.getElementById('btn_add_humor')
const humor_btns_section = document.querySelector('.humor_btns')
const humor_btns = document.querySelectorAll('.humor_btns button')
const title_daily_message = document.getElementById('title_daily_message')
const loveable_icon = document.getElementById('loveable_icon_svg');
const humorF = document.getElementById("humorF")
const humorJ = document.getElementById("humorJ")


const API_URL = 'https://backend-loveable.onrender.com';

toggle.addEventListener('click', () => {
    if (pickerDiv.style.display === 'none') {
        pickerDiv.style.display = ''
    } else {
        pickerDiv.style.display = 'none'
    }
})

const picker = new EmojiMart.Picker({
    onEmojiSelect: emoji => {
        toggle.textContent = emoji.native;
        pickerDiv.style.display = 'none'
    }
});
pickerDiv.appendChild(picker);

btn_add_humor.onclick = () => {
    humor_btns_section.style.display = ''
    humor_btns_section.classList.toggle('humor_btns-active')
}

async function getHumor() {
    const token = localStorage.getItem('token')

    try {
       const res = await fetch(`${API_URL}/status/get-humor`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
       });

       const data = await res.json()

       if (!res.ok) {
        return alert(data.error);
       }

       console.log(data.message)

       const humor = data.humor;
const user = data.username;

const humorCorrigido = () => {
  if ((humor === 'Brava' || humor === 'Chateada') && user === 'Felipe') {
    return humor === 'Brava' ? 'Bravo' : 'Chateado';
  } else {
    return humor;
  }
}

const setHumor = () => {
      if (humor == 'Muito Feliz') {
        daily_message_box.style.border = 'solid #44ff00'
        loveable_icon.style.fill = '#04ff04';
      } else if (humor == 'Feliz') {
        daily_message_box.style.border = 'solid #31d931'
        loveable_icon.style.fill = '#31d931';
      } else if (humor == 'Normal') {
        daily_message_box.style.border = 'solid #0000F5'
        loveable_icon.style.fill = '#0000F5'
      } else if (humor == 'Triste') {
        daily_message_box.style.border = 'solid #FFFF55'
        loveable_icon.style.fill = '#FFFF55'
      } else if (humor == 'Chateada') {
        daily_message_box.style.border = 'solid #F19E39'
        loveable_icon.style.fill = '#F19E39'
      } else {
        daily_message_box.style.border = 'solid #EA3323'
        loveable_icon.style.fill = '#EA3323'
      }
    }

      title_daily_message.innerHTML = `${data.parceiro} esta ${humorCorrigido(user.humor)}`

      const res2 = await fetch(`${API_URL}/status/get-my-humor`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
      });

      const data2 = await res2.json()

      const myHumor = data2.humor

      const getMySvgHumor = () => {
      if (myHumor == 'Muito Feliz') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                        fill="#44ff00">
                        <path
                            d="M320-480v80q0 66 47 113t113 47q66 0 113-47t47-113v-80H320Zm160 180q-42 0-71-29t-29-71v-20h200v20q0 42-29 71t-71 29ZM340-680q-38 0-67.5 27.5T231-577l58 14q6-26 20-41.5t31-15.5q17 0 31 15.5t20 41.5l58-14q-12-48-41.5-75.5T340-680Zm280 0q-38 0-67.5 27.5T511-577l58 14q6-26 20-41.5t31-15.5q17 0 31 15.5t20 41.5l58-14q-12-48-41.5-75.5T620-680ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z" />
                    </svg>`
      } else if (myHumor == 'Feliz') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#31d931">
                        <path
                            d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm140 260q68 0 123.5-38.5T684-400H276q25 63 80.5 101.5T480-260Zm0 180q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z" />
                    </svg>`
      } else if (myHumor == 'Normal') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#0000F5">
                        <path
                            d="M335.9-480q41.1 0 68.6-29 27.5-29 38.5-70l-70-18q-4 17-12.5 31T336-552q-16 0-24.5-14T299-597l-70 18q11 41 38.4 70t68.5 29ZM480-264q40.05 0 77.03-18.5Q594-301 626-336l-52-48q-21.11 23.02-45.1 35.01-24 11.99-48.95 11.99-24.95 0-48.91-11.99Q407.08-360.98 386-384l-52 48q32 35 68.79 53.5Q439.58-264 480-264Zm143.9-216q41.1 0 68.6-29 27.5-29 38.5-70l-70-18q-4 17-12.5 31T624-552q-16 0-24.5-14T587-597l-70 18q11 41 38.4 70t68.5 29ZM480.28-96Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30ZM480-480Zm0 312q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Z" />
                    </svg>`
      } else if (myHumor == 'Triste') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFFF55">
                        <path
                            d="M612-504q25 0 42.5-17.5T672-564q0-25-17.5-42.5T612-624q-25 0-42.5 17.5T552-564q0 25 17.5 42.5T612-504Zm-264 0q25 0 42.5-17.5T408-564q0-25-17.5-42.5T348-624q-25 0-42.5 17.5T288-564q0 25 17.5 42.5T348-504Zm132.1 72q-69.1 0-125.6 39T277-288h79q19.92-33.3 52.96-52.65T480-360q38 0 71.04 19.35Q584.08-321.3 604-288h79q-21-66-77.4-105-56.4-39-125.5-39Zm.18 336Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30ZM480-480Zm0 312q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Z" />
                    </svg>`
      } else if (myHumor == 'Chateada') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                        fill="#F19E39">
                        <path
                            d="M264-336h72v-23q0-60.14 41.9-102.07Q419.8-503 479.9-503T582-461.07q42 41.93 42 102.07v23h72v-23q0-90.16-62.89-153.08-62.89-62.92-153-62.92T327-512.08Q264-449.16 264-359v23Zm29-252q40-5 84-29.5t70-54.5l-54-48q-18 20-50.5 38T283-660l10 72Zm374 0 10-72q-27-4-59.5-22T567-720l-54 48q26 30 70 54.5t84 29.5ZM480.28-96Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30ZM480-480Zm0 312q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Z" />
                    </svg>`
      } else {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#EA3323">
                        <path
                            d="M480-96q-79.38 0-149.19-30T208.5-208.5Q156-261 126-330.96t-30-149.5Q96-560 126-630q30-70 82.5-122t122.46-82q69.96-30 149.5-30t149.55 30.24q70 30.24 121.79 82.08 51.78 51.84 81.99 121.92Q864-559.68 864-480q0 79.38-30 149.19T752-208.5Q700-156 629.87-126T480-96Zm.48-72q129.47 0 220.5-91.5Q792-351 792-480.48q0-129.47-91.02-220.5Q609.95-792 480.48-792 351-792 259.5-700.98 168-609.95 168-480.48 168-351 259.5-259.5T480.48-168ZM536-522l19-11q1.9 22.71 18.05 37.86Q589.2-480 612-480q23.33 0 39.67-17Q668-514 668-537.13q0-13.88-6.5-26.38Q655-576 643-584l33-19-26-39-140 80 26 40Zm-113 0 26-40-140-80-26 39 34 19q-12 7.52-19 20.21-7 12.69-7 26.79 0 23 17 40t40.49 17q22.56 0 38.53-15Q403-510 405-533l18 11Zm57.76 90Q418-432 370.5-391.5 323-351 312-288h336q-9-63-56.74-103.5-47.73-40.5-110.5-40.5Zm.24-49Z" />
                    </svg>`
      }
    }

      const getSvgHumor = () => {
      if (humor == 'Muito Feliz') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                        fill="#44ff00">
                        <path
                            d="M320-480v80q0 66 47 113t113 47q66 0 113-47t47-113v-80H320Zm160 180q-42 0-71-29t-29-71v-20h200v20q0 42-29 71t-71 29ZM340-680q-38 0-67.5 27.5T231-577l58 14q6-26 20-41.5t31-15.5q17 0 31 15.5t20 41.5l58-14q-12-48-41.5-75.5T340-680Zm280 0q-38 0-67.5 27.5T511-577l58 14q6-26 20-41.5t31-15.5q17 0 31 15.5t20 41.5l58-14q-12-48-41.5-75.5T620-680ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z" />
                    </svg>`
      } else if (humor == 'Feliz') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#31d931">
                        <path
                            d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm140 260q68 0 123.5-38.5T684-400H276q25 63 80.5 101.5T480-260Zm0 180q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z" />
                    </svg>`
      } else if (humor == 'Normal') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#0000F5">
                        <path
                            d="M335.9-480q41.1 0 68.6-29 27.5-29 38.5-70l-70-18q-4 17-12.5 31T336-552q-16 0-24.5-14T299-597l-70 18q11 41 38.4 70t68.5 29ZM480-264q40.05 0 77.03-18.5Q594-301 626-336l-52-48q-21.11 23.02-45.1 35.01-24 11.99-48.95 11.99-24.95 0-48.91-11.99Q407.08-360.98 386-384l-52 48q32 35 68.79 53.5Q439.58-264 480-264Zm143.9-216q41.1 0 68.6-29 27.5-29 38.5-70l-70-18q-4 17-12.5 31T624-552q-16 0-24.5-14T587-597l-70 18q11 41 38.4 70t68.5 29ZM480.28-96Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30ZM480-480Zm0 312q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Z" />
                    </svg>`
      } else if (humor == 'Triste') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFFF55">
                        <path
                            d="M612-504q25 0 42.5-17.5T672-564q0-25-17.5-42.5T612-624q-25 0-42.5 17.5T552-564q0 25 17.5 42.5T612-504Zm-264 0q25 0 42.5-17.5T408-564q0-25-17.5-42.5T348-624q-25 0-42.5 17.5T288-564q0 25 17.5 42.5T348-504Zm132.1 72q-69.1 0-125.6 39T277-288h79q19.92-33.3 52.96-52.65T480-360q38 0 71.04 19.35Q584.08-321.3 604-288h79q-21-66-77.4-105-56.4-39-125.5-39Zm.18 336Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30ZM480-480Zm0 312q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Z" />
                    </svg>`
      } else if (humor == 'Chateada') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                        fill="#F19E39">
                        <path
                            d="M264-336h72v-23q0-60.14 41.9-102.07Q419.8-503 479.9-503T582-461.07q42 41.93 42 102.07v23h72v-23q0-90.16-62.89-153.08-62.89-62.92-153-62.92T327-512.08Q264-449.16 264-359v23Zm29-252q40-5 84-29.5t70-54.5l-54-48q-18 20-50.5 38T283-660l10 72Zm374 0 10-72q-27-4-59.5-22T567-720l-54 48q26 30 70 54.5t84 29.5ZM480.28-96Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30ZM480-480Zm0 312q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Z" />
                    </svg>`
      } else {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#EA3323">
                        <path
                            d="M480-96q-79.38 0-149.19-30T208.5-208.5Q156-261 126-330.96t-30-149.5Q96-560 126-630q30-70 82.5-122t122.46-82q69.96-30 149.5-30t149.55 30.24q70 30.24 121.79 82.08 51.78 51.84 81.99 121.92Q864-559.68 864-480q0 79.38-30 149.19T752-208.5Q700-156 629.87-126T480-96Zm.48-72q129.47 0 220.5-91.5Q792-351 792-480.48q0-129.47-91.02-220.5Q609.95-792 480.48-792 351-792 259.5-700.98 168-609.95 168-480.48 168-351 259.5-259.5T480.48-168ZM536-522l19-11q1.9 22.71 18.05 37.86Q589.2-480 612-480q23.33 0 39.67-17Q668-514 668-537.13q0-13.88-6.5-26.38Q655-576 643-584l33-19-26-39-140 80 26 40Zm-113 0 26-40-140-80-26 39 34 19q-12 7.52-19 20.21-7 12.69-7 26.79 0 23 17 40t40.49 17q22.56 0 38.53-15Q403-510 405-533l18 11Zm57.76 90Q418-432 370.5-391.5 323-351 312-288h336q-9-63-56.74-103.5-47.73-40.5-110.5-40.5Zm.24-49Z" />
                    </svg>`
      }
    }

    const setMyIconSvg = getMySvgHumor()
    const setIconSvg = getSvgHumor()

    humorF.innerHTML = setMyIconSvg
    humorJ.innerHTML = setIconSvg

      setHumor()
    } catch (error) {

    }
}

async function get_day_message() {
    const token = localStorage.getItem('token')

    try {
        const res = await fetch(`${API_URL}/message/get-day-message`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await res.json()

        if (!res.ok) {
            return alert(data.error);
        }

        console.log(data)

        message_of_the_day.innerHTML = `${data.message}`
        daily_message_reaction.innerHTML = `${data.reaction}`

    } catch (error) {
        console.error(error)
        alert(error)
    }
}

async function post_message() {
    const token = localStorage.getItem('token')
    const message = input.value.trim()
    const reaction = toggle.textContent

    if (!message) {
        return alert('Campo de mensagem vazio');
    }

    try {
        const res = await fetch(`${API_URL}/message/post-day-message`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ message, reaction })
        });

        const data = await res.json()

        if (!res.ok) {
            return alert( data.error || 'erro ao postar mensagem');
        }

        pickerDiv.style.display = 'none'
        input.value = ''
        alert( data.message || 'Mensagem salva com sucesso');
    } catch (error) {
      console.error(error)
      alert(error)
    }
};

humor_btns.forEach((btn) => {
    btn.onclick = async () => {
        const token = localStorage.getItem('token')
        const humor = btn.value
        try {
            const res = await fetch(`${API_URL}/status/post-humor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ humor })
            });

            const data = await res.json()

            if (!res.ok) {
                alert(data.error)
                return;
            }

            alert(data.message);
        } catch (error) {
            console.error(error)
            alert(error);
        }
    }
})
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        post_message()
    }
})

window.addEventListener('load', async () => {
    get_day_message()
    getHumor()
})

setInterval(() => {
    getHumor()
    get_day_message()

}, 2000);
