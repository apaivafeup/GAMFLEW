using System.Collections;
using System.Collections.Generic;
using Unity.VisualScripting;
using UnityEngine;
using System.Linq;
using UnityEngine.EventSystems;

public enum CanvasType
{
    MainMenu,
    NewGameMenu,
    CheckersGameMenu,
    CheckersChallenges,
    Game,
    OptionsMenu
}

public class CanvasManager : Singleton<CanvasManager>
{
    List<CanvasController> controllers;
    CanvasController lastActiveCanvas;

    private void Start()
    {
        controllers = GetComponentsInChildren<CanvasController>().ToList();

        controllers.ForEach(x => x.gameObject.SetActive(false));

        SwitchCanvas(CanvasType.MainMenu);
    }

    public void SwitchCanvas(CanvasType canvasType)
    {
        CanvasController desiredCanvas = controllers.Find(x => x.canvasType == canvasType);

        if (lastActiveCanvas != null)
            lastActiveCanvas.gameObject.SetActive(false);

        if (desiredCanvas != null)
        {
            desiredCanvas.gameObject.SetActive(true);
            lastActiveCanvas = desiredCanvas;
        }
    }
}
