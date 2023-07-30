using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Unity.VisualScripting;
using UnityEngine;

public class ChallengeBoard : MonoBehaviour
{
    public Piece[,] pieces = new Piece[8, 8];
    public GameObject whitePiecePrefab;
    public GameObject blackPiecePrefab;

    private protected Vector3 boardOffset = new(-4.0f, 0, -4.0f);
    private protected Vector3 pieceOffset = new(0.5f, 0, 0.5f);

    private protected bool hasKilled;
    private protected bool finished;

    private protected Piece selectedPiece;
    private protected List<Piece> forcedPieces;

    private protected Vector2 mouseOver;
    private protected Vector2 startDrag;
    private protected Vector2 endDrag;

    private protected Material original;
    private protected Material selected;
    private protected Material highlighted;

    public virtual void Start()
    {
        whitePiecePrefab = (GameObject)Resources.Load("Prefabs/WhitePieceVariant");
        blackPiecePrefab = (GameObject)Resources.Load("Prefabs/BlackPieceVariant");

        original = (Material)Resources.Load("Materials/Atlas");
        selected = (Material)Resources.Load("Materials/SelectedMaterial");
        highlighted = (Material)Resources.Load("Materials/HighlightedMaterial");

        forcedPieces = new List<Piece>();
        GenerateBoard();
    }
    private protected void Update()
    {
        UpdateMouseOver();

        int x = (int)mouseOver.x;
        int y = (int)mouseOver.y;

        if (selectedPiece != null)
        {
            UpdatePieceDrag(selectedPiece);
        }

        if (Input.GetMouseButtonDown(0))
        {
            SelectPiece(x, y);
        }

        if (Input.GetMouseButtonUp(0))
        {
            if (selectedPiece != null)
                selectedPiece.GetComponent<MeshRenderer>().material = original;

            TryMove((int)startDrag.x, (int)startDrag.y, x, y);
            selectedPiece = null;
            startDrag = Vector2.zero;
        }
    }

    private protected void TryMove(int startX, int startY, int endX, int endY)
    {

        startDrag = new Vector2(startX, startY);
        endDrag = new Vector2(endX, endY);
        selectedPiece = pieces[startX, startY];

        MovePiece(selectedPiece, endX, endY);

        // Check for out of bounds.
        if (endX < 0 || endX > 7 || endY < 0 || endY > 7)
        {
            if (selectedPiece != null)
                MovePiece(selectedPiece, startX, startY);

            startDrag = Vector2.zero;
            selectedPiece = null;
            return;
        }

        // If there is a selected Piece.
        if (selectedPiece != null)
        {
            // If no move is registered.
            if (endDrag == startDrag)
            {
                MovePiece(selectedPiece, startX, startY);
                startDrag = Vector2.zero;
                selectedPiece = null;
                return;
            }

            // Did we kill anything - is this a jump.

            if (Mathf.Abs(startX - endX) == 2)
            {
                Piece p = pieces[(startX + endX) / 2, (startY + endY) / 2];

                //if (p != null && selectedPiece.isWhite != p.isWhite)
                //{
                //    pieces[(startX + endX) / 2, (startY + endY) / 2] = null;
                //    Destroy(p.gameObject);
                //    hasKilled = true;
                //}
            }

            pieces[endX, endY] = selectedPiece;
            pieces[startX, startY] = null;
            MovePiece(selectedPiece, endX, endY);
        }
        else
        {
            MovePiece(selectedPiece, startX, startY);
            startDrag = Vector2.zero;
            selectedPiece = null;
            return;
        }
    }
    private protected void UpdateMouseOver()
    {
        if (!Camera.main)
        {
            Debug.Log("Unable to find main camera.");
            return;
        }

        if (Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), out RaycastHit hit, 25.0f, LayerMask.GetMask("Board")) || !finished)
        {
            mouseOver.x = (int)(hit.point.x - boardOffset.x);
            mouseOver.y = (int)(hit.point.z - boardOffset.z);
        }
        else
        {
            mouseOver.x = -1;
            mouseOver.y = -1;
        }
    }
    private protected void UpdatePieceDrag(Piece p)
    {
        if (!Camera.main)
        {
            Debug.Log("Unable to find main camera.");
            return;
        }

        if (Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), out RaycastHit hit, 25.0f, LayerMask.GetMask("Board")))
        {
            p.transform.position = hit.point + Vector3.up;
        }
    }
    private protected void SelectPiece(int x, int y)
    {
        // Check for out of bounds.
        if (x < 0 || x >= 8 || y < 0 || y >= 8)
            return;

        Piece p = pieces[x, y];
        if (p != null)
        {
            if (forcedPieces.Count == 0)
            {
                selectedPiece = p;
                selectedPiece.GetComponent<MeshRenderer>().material = selected;
                startDrag = mouseOver;
            }
            else
            {
                selectedPiece = p;
                selectedPiece.GetComponent<MeshRenderer>().material = selected;
                startDrag = mouseOver;

            }
        }

    }
    private protected virtual void GenerateBoard()
    {
        // Generate white team - first 3 rows.
        for (int y = 0; y < 3; y++)
        {
            for (int x = 0; x < 8; x += 2)
            {
                GeneratePiece((y % 2 == 0 ? x : x + 1), y);
            }
        }

        // Generate black team - first 3 rows.
        for (int y = 7; y > 4; y--)
        {
            for (int x = 0; x < 8; x += 2)
            {
                GeneratePiece((y % 2 == 0 ? x : x + 1), y);
            }
        }

    }
    private protected void GeneratePiece(int x, int y)
    {
        GameObject go = Instantiate(y < 4 ? whitePiecePrefab : blackPiecePrefab) as GameObject;
        go.transform.SetParent(transform);
        Piece p = go.GetComponent<Piece>();
        p.transform.SetParent(GameObject.Find("Board").transform);
        pieces[x, y] = p;
        MovePiece(p, x, y);
    }
    private protected void MovePiece(Piece p, int x, int y)
    {
        if (p != null)
        {
            p.transform.position = (Vector3.right * x) + (Vector3.forward * y) + boardOffset + pieceOffset;
            p.setPosition(x, y);
        }
    }
}
