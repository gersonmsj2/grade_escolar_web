import { AxiosStatic } from "axios";
import Grade from "@/models/Grade";
import Disciplina from "@/models/Disciplina";
import Aula from "@/models/Aula";
import Anotacao from "@/models/Anotacao";

export default class Api {
    private axios: AxiosStatic;
    usuario: string;
    login: string;
    disciplina: string;
    grade: string;
    aula: string;
    anotacao: string;

    constructor(axios: AxiosStatic) {
        this.axios = axios;
        this.usuario = process.env.VUE_APP_GE_API + process.env.VUE_APP_GE_API_USUARIO;
        this.login = process.env.VUE_APP_GE_API + process.env.VUE_APP_GE_API_LOGIN;
        this.disciplina = process.env.VUE_APP_GE_API + process.env.VUE_APP_GE_API_DISCIPLINA;
        this.grade = process.env.VUE_APP_GE_API + process.env.VUE_APP_GE_API_GRADE;
        this.aula = process.env.VUE_APP_GE_API + process.env.VUE_APP_GE_API_AULA;
        this.anotacao = process.env.VUE_APP_GE_API + process.env.VUE_APP_GE_API_ANOTACAO;
    }

    async obterGrade(): Promise<Grade> {
        let response = await this.axios.get<Grade>(this.grade)
        return Promise.resolve(response.data);
    }

    async obterDisciplinas(): Promise<Disciplina[]> {
        let response = await this.axios.get<Disciplina[]>(this.disciplina)
        return Promise.resolve(Disciplina.sort(response.data));
    }

    async obterGradeDisciplinas(): Promise<[Grade, Disciplina[]]> {
        let pG = this.axios.get<Grade>(this.grade);
        let pD = this.axios.get<Disciplina[]>(this.disciplina);
        let [rG, rD] = await Promise.all([pG, pD]);
        return Promise.resolve([rG.data, rD.data]);
    }

    async obterAulas(id_grade: number, dia: number): Promise<Aula[]> {
        let aulaPesquisa = new Aula();
        aulaPesquisa.id_grade = id_grade;
        aulaPesquisa.dia = dia;
        let response = await this.axios.post<Aula[]>(this.aula, aulaPesquisa);
        return response.data;
    }

    async obterAnotacaoGrade(aula: Aula, data: string): Promise<Anotacao> {
        let anotacaoPesquisa = new Anotacao();
        anotacaoPesquisa.aula = aula.aula;
        anotacaoPesquisa.id_disciplina = aula.id_disciplina!;
        anotacaoPesquisa.data = data;
        anotacaoPesquisa.modo = 'grade';
        let response = await this.axios.post<Anotacao>(this.anotacao, anotacaoPesquisa);
        let anotacao = response.data;
        return anotacao?.id ? anotacao : anotacaoPesquisa;
    }

    async obterAnotacoes(disciplina: Disciplina, mes: string): Promise<Anotacao[]> {
        let anotacaoPesquisa = new Anotacao();
        anotacaoPesquisa.id_disciplina = disciplina.id!;
        anotacaoPesquisa.data = `${mes}-01`;
        anotacaoPesquisa.modo = 'disciplina';
        let response = await this.axios.post<Anotacao[]>(this.anotacao, anotacaoPesquisa);
        return response.data;
    }

    async salvarAnotacao(anotacao: Anotacao) {
        await this.axios.put(this.anotacao, anotacao);
    }
}