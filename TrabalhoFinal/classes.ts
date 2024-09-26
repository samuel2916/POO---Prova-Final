import prompt from 'prompt-sync';
import { AplicacaoError, CadastroDuplicadoError, UsuarioNaoEncontradoError, PublicacaoNaoEncontradaError, InteracaoRepetidaError} from './erros';

class Usuario {
    //Atributos e construtores
    private _id : number;
    private _email : string;
    private _apelido : string;
    private _documento : string;

    constructor(id: number, email: string, apelido: string, documento : string) {
        this._id = id;
        this._email = email;
        this._apelido = apelido;
        this._documento = documento;
    }

    //Metodos de leitura
    get id(): number{
        return this._id;
    }
    get email(): string{
        return this._email;
    }
    get apelido(): string{
        return this._apelido;
    }
    get documento(): string{
        return this._documento;
    }
}

class Publicacao {
    //Atributos e construtores
    private _id : number;
    private _usuario : Usuario;
    private _conteudo : string;
    private _dataHora : Date;

    private _comentarios : comentario[];

    constructor(id: number, usuario: Usuario, conteudo: string) {
        this._id = id;
        this._usuario = usuario;
        this._conteudo = conteudo;
        this._dataHora = new Date();
        this._comentarios = []
    }

    inserir_comentario(novo_comentario : comentario){
        this._comentarios.push(novo_comentario)
    }

    //Metodos de leitura
    get id(): number{
        return this._id;
    }
    get usuario(): Usuario{
        return this._usuario;
    }
    get conteudo(): string{
        return this._conteudo;
    }

    get comentarios(): comentario[]{
        return this._comentarios;
    }

    set conteudo(valor : string) {
        this._conteudo = valor;
    }

    get dataHora(): string{
        let hora = this._dataHora.getHours()
        let min = this._dataHora.getMinutes()
        let seg = this._dataHora.getSeconds()

        return `${hora}:${min}:${seg}`
    }

    get toString(): string {
        return `\n
    _________________________________________________
    => Usuario: ${this._usuario.apelido}
    => Post id: ${this._id} 
    _________________________________________________
    > : ${this._conteudo}
    _________________________________________________
    ${this.dataHora}                                 `
    }

    get toStringComentarios(): string{
        let Comentarios : string = " "
        for(let i : number = 0; i < this.comentarios.length; i ++){
            Comentarios += this.comentarios[i].toString
        }
        
        return Comentarios
    }

}

class PublicacaoAvancada extends Publicacao{
    private _Interacoes : Interacao[]; 
    
    constructor(id: number, usuario: Usuario, conteudo: string) {
        super(id, usuario, conteudo); //contrutor da superclasse
        this._Interacoes = [] 
    }

    inserir_reacao(nova_Interacao : Interacao){

        for(let interacao of this._Interacoes){
            if(nova_Interacao.usuario.id == interacao.usuario.id){ //verifica se o usuario ja interagiu com essa publicacao
                throw new InteracaoRepetidaError("Você já interagiu com essa publicação antes.")
            }
        }

        this._Interacoes.push(nova_Interacao); //adiciona a reacao na colecao de reacoes da publicacao
    }

    get Interacoes(): Interacao []{
        return this._Interacoes;
    }

    get toString() {
        return `\n
    _________________________________________________
    => Usuario: ${this.usuario.apelido}
    => Post id: ${this.id} 
    _________________________________________________
    > : ${this.conteudo}
    _________________________________________________
    ${this.dataHora}
    - Reações : ${this.Interacoes.length}                                 `
    }

    get toStringInteracoes(): string{
        let interacoes : string = " "
        for(let i : number = 0; i < this.Interacoes.length; i ++){
            interacoes += this.Interacoes[i].toString
        }
        
        return interacoes
    }
    
}

//Tipos enumerados 

enum TipoInteracao{
    "curtida" = 1,
    "naocurtir" = 2,
    "riso" = 3,
    "surpresa" = 4,
    "triste" = 5
}

class Interacao {
    //Atributos e construtores
    private _id : number;
    private _publicacao : Publicacao;
    private _tipoInteracao : TipoInteracao;
    private _usuario : Usuario;
    private _dataHora : Date;

    constructor(id: number, P : Publicacao, T: TipoInteracao, U: Usuario) {
        this._id = id;
        this._publicacao = P;
        this._tipoInteracao = T;
        this._usuario = U;
        this._dataHora = new Date;
    }

    //metodos de leitura
    get id(): number{
        return this._id;
    }
    get publicacao(): Publicacao{
        return this._publicacao;
    }
    get tipo(){
        return this._tipoInteracao;
    }
    get usuario(): Usuario{
        return this._usuario;
    }

    get dataHora(): string{
        let hora = this._dataHora.getHours()
        let min = this._dataHora.getMinutes()
        let seg = this._dataHora.getSeconds()

        return `${hora}:${min}:${seg}`
    }

    get toString(): string {
        return `\n
    _________________________________________________
    Data : ${this.dataHora}
    Usuario : ${this.usuario.apelido}
    Tipo : ${this.tipo == 1? "curtida": this.tipo == 2 ? "deslike": this.tipo == 3? "riso": this.tipo == 4? "surpresa": "triste"}
    _________________________________________________`
    }
}

class comentario {
    private _autor : Usuario;
    private _dataHora : Date;
    private _texto : string;
    private _publicacao : Publicacao;

    constructor(autor: Usuario, texto: string, publicacao: Publicacao){
        this._autor = autor;
        this._texto = texto;
        this._publicacao = publicacao;
        this._dataHora = new Date;
    }

    //metodos de leitura
    get autor(): Usuario {
        return this._autor
    }

    get texto(): string {
        return this._texto
    }

    get publicacao(): Publicacao {
        return this._publicacao;
    }

    get dataHora(): string{
        let hora = this._dataHora.getHours()
        let min = this._dataHora.getMinutes()
        let seg = this._dataHora.getSeconds()

        return `${hora}:${min}:${seg}`
    }

    get toString(): string {
        return `\n
    _________________________________________________
    ${this.dataHora} | ${this.autor.apelido}   
    >:${this.texto}
    _________________________________________________`
    }
}

class RedeSocial {
    private _Usuarios : Usuario[] = [];
    private _Publicações : Publicacao[] = [];

    get Usuarios(){
        return this._Usuarios;
    }

    get Publicacoes(){
        return this._Publicações;
    }

    //metodos de inclusao e consulta de usuarios
    Inserir_Usuario(newUser: Usuario){
        for(let Usuario of this._Usuarios){
            if(Usuario.id == newUser.id){
                throw new CadastroDuplicadoError("Não é possivel adicionar Usuarios com o mesmo Id.")              
            }
            if(Usuario.email == newUser.email){
                throw new CadastroDuplicadoError("Não é possivel adicionar Usuarios com o mesmo email.")
            }
        }

        this._Usuarios.push(newUser);
    }

    Consultar_Usuario(email: string) : Usuario{
        let Usuario_procurado! : Usuario;
        for(let i : number = 0; i < this._Usuarios.length; i++){
            if(this._Usuarios[i].email == email){
                Usuario_procurado = this._Usuarios[i];
                break;
            }
        }

        if(Usuario_procurado == null){
            throw new UsuarioNaoEncontradoError("Nenhum usuario encontrado com esse email: "+ email);
        }

        return Usuario_procurado
    }

    Consultar_Usuario_por_id(id: number) : Usuario{
        let Usuario_procurado! : Usuario;
        for(let i : number = 0; i < this._Usuarios.length; i++){
            if(this._Usuarios[i].id == id){
                Usuario_procurado = this._Usuarios[i];
                break;
            }
        }

        if(Usuario_procurado == null){
            throw new UsuarioNaoEncontradoError("Nenhum usuario encontrado com esse id: "+ id);
        }

        return Usuario_procurado
    }

    Consultar_Indice_Usuario(id: number): number {
        let p = this.Consultar_Usuario_por_id(id); //procura se o usuario existe
        let indice : number = -1;

        for(let i : number = 0; i < this._Usuarios.length; i++){
            if(this._Usuarios[i].id == id){ //procura o indice do Usuario com o id igual ao fornecido
                indice = i; 
                break;
            }
        }

        return indice;
    }

    Excluir_Usuario(id: number){
        let indice = this.Consultar_Indice_Usuario(id)

        for(let i : number = indice; i < this._Usuarios.length; i++){
            this._Usuarios[i] = this._Usuarios[i + 1]
        }

        this._Usuarios.pop();
    }

    //metodos de inclusao e consulta de publicacoes
    Inserir_Publicacao(newPublicacao: Publicacao){
        for(let Publi of this._Publicações){
            if(newPublicacao.id == Publi.id){
                throw new CadastroDuplicadoError("Não é possivel adicionar Publicacoes com o mesmo Id.")              
            }
        }

        this._Publicações.push(newPublicacao);
    }

    Consultar_Publicacao(id: number): Publicacao {
        let Publicacao_procurada! : Publicacao;
        for(let i : number = 0; i < this._Publicações.length; i++){
            if(this._Publicações[i].id == id){
                Publicacao_procurada = this._Publicações[i];
                break;
            }
        }

        if(Publicacao_procurada == null){
            throw new PublicacaoNaoEncontradaError("Nenhuma publicacao encontrada com esse id: "+ id);
        }

        return Publicacao_procurada;
    }

    Consultar_Indice_Publicacao(id: number): number {

        let p = this.Consultar_Publicacao(id); //procura se a publicacao existe
        let indice : number = -1;

        for(let i : number = 0; i < this._Publicações.length; i++){
            if(this._Publicações[i].id == id){ //procura o indice da publicação com o id igual ao fornecido
                indice = i; 
                break;
            }
        }

        return indice;
    }

    Excluir_publicacao(id: number){
        let indice = this.Consultar_Indice_Publicacao(id)

        for(let i : number = indice; i < this._Publicações.length; i++){
            this._Publicações[i] = this._Publicações[i + 1]
        }

        this._Publicações.pop();
    }

}


export {Usuario, Publicacao, PublicacaoAvancada, Interacao, TipoInteracao, RedeSocial, comentario}