{pkgs, ...}: {
  channel = "unstable";
  packages = [
    pkgs.vim
    pkgs.git
    pkgs.bun
    pkgs.deno
    ];
}
