import { ABI, ticketContractAdress } from "./config.js";

let web3js ;
let account;
let contract;
let main=async ()=>{
    if(!window.ethereum)
        return alert('please download metamask')
    window.ethereum.on('accountsChanged', (accounts)=>{
        account=accounts[0]
        accountElement.innerText=account;
    })
    web3js = new Web3(window.ethereum);
    account=(await web3js.eth.requestAccounts())[0]
    accountElement.innerText=account;
    console.log(account);
    //creattion de l'objet 
    contract = new web3js.eth.Contract(ABI,ticketContractAdress);
    console.log('contract',contract)
    let nomEvenement = await contract.methods.nomEvenement().call()
    //await contract.methods.methodeName(parm1, parm2,....) => promise
    console.log(nomEvenement)
    titleElement.innerText=nomEvenement
    //recuperation du nombre de tickets
    let nbrTicket = await contract.methods.nbrTicket().call()
    console.log(nbrTicket)
    let tickets = []
    for (let index = 0; index < nbrTicket; index++) {
        let ticket = await contract.methods.tickets(index).call()
        console.log(ticket)
        tickets.push(ticket)
        display(ticket)
    }
    

}
main()
let display=(ticket)=>{
    var row = document.createElement('tr');
    // Create a new cell element for the ticket ID
    var cell = document.createElement('td');
    cell.innerText = ticket.id; // Assuming the ID property of the ticket object is called "id"
    // Append the cell to the row    
    row.appendChild(cell);
    var cell = document.createElement('td');
    cell.innerText = ticket.acheteur; // Assuming the ID property of the ticket object is called "id"
    // Append the cell to the row    
    row.appendChild(cell);
    var cell = document.createElement('td');
    cell.innerText = ticket.enVente?'Disponible':'Indisponible'; // Assuming the ID property of the ticket object is called "id"
    // Append the cell to the row    
    row.appendChild(cell);
    var cell = document.createElement('td');
    cell.innerText=web3js.utils.fromWei(ticket.prix)+'Eth' ; // Assuming the ID property of the ticket object is called "id"
    // Append the cell to the row    
    row.appendChild(cell);
    var Button = document.createElement('button');
    // Create a new cell element for the buttons
    var buttonCell = document.createElement('td');
    if (ticket.enVente==true) {
        if (ticket.acheteur==account) {
            Button.innerText = "Unsell";
            Button.addEventListener('click',async ()=>{
            contract.methods.vendre(false,ticket.prix).send({ 
                from: account,
                gas:200000,
                gasPrice: await web3js.eth.getGasPrice(),
            }).then(
                console.log("unSalle successful!") // Optional: Display a success message
            ).catch (error=>console.log('unSalle failed',error)) ;
            })
        }else{
            Button.innerText = "Pay";
            Button.addEventListener('click',async ()=>{
            // Call the 'pay' function in the smart contract
            contract.methods.acheter(ticket.id).send({ 
                from: account,
                value:ticket.prix,
                gas:200000,
                gasPrice: await web3js.eth.getGasPrice(),
             }).then(
                console.log("Payment successful!") // Optional: Display a success message
             ).catch (error=>console.log('Payment failed:',error)) ;
    })
     
        }
    }else{
        if (ticket.acheteur==account) {
            // Create a button for "Sell"
            Button.innerText = "Sell";
            Button.addEventListener('click',async ()=>{
            contract.methods.vendre(ticket.id,'2000000000000000000').send({ 
            from: account,
            gas:200000,
            gasPrice: await web3js.eth.getGasPrice(),
         }).then(
            console.log("salle successful!") // Optional: Display a success message
         ).catch (error=>console.log('salle failed',error)) ;
    })
        }
    }
    buttonCell.appendChild(Button),
    row.appendChild(buttonCell);
    // Append the row to the tbodyElement
    tbodyElement.appendChild(row);
}

//recuperation du compte
//recuperation du nom d'evenemet
//recuperation du nombre de tickets
//recuperation des tickets et leur infos
//envoyer une transaction d'achet
//envoyer une transaction de remettre en vente un ticket
//envoyer une transaction de retirer le ticket (plus en vente)