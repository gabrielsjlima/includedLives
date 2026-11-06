package br.com.includedlives.app;

import br.com.includedlives.view.MenuConsole;

public class Main {
    public static void main(String[] args) {
        MenuConsole menu = new MenuConsole();
        menu.inicializarDadosDemo();
        menu.executar();
    }
}